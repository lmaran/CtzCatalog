using Attribute = Web.Models.Attribute; // Type alias

using Web.Helpers;
using Web.Models;
using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using Web.Repositories.Mongo;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Driver.Builders;
using System.IO;
using System.Drawing;
using Microsoft.WindowsAzure.Storage.Blob;
using Web.App_Start;
using System.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Web.Repositories.Azure;
using System.Drawing.Imaging;

namespace Web.Repositories
{
    public class ProductRepository : IProductRepository
    {

        private readonly MongoCollection<Product> _collection;

        public ProductRepository() {
            _collection = MongoContext.AppInstance.Database.GetCollection<Product>(MongoConstants.Collections.Products);
        }


        public void Create(Product item)
        {
            _collection.Insert(item);
        }

        public IEnumerable<Product> GetAll()
        {
            return _collection.FindAll();
        }

        public Product GetById(string itemId)
        {
            var xx =  _collection.FindOneById(ObjectId.Parse(itemId));
            return xx;
        }

        public void Update(Product item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<Product>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }

        
        // ***************** Related Services ****************
        
        public void UpdateAttrName(Attribute newAttribute)
        {
            //var queryAttr = Query<Attribute>.EQ(x => x.Id, newAttribute.Id);
            //var query = Query<Product>.ElemMatch(x => x.Attributes, builder => queryAttr);

            //var update = MongoDB.Driver.Builders.Update.Set("Attributes.$.Name", newAttribute.Name);

            var query = new QueryDocument { 
                {"Attributes._id", ObjectId.Parse(newAttribute.Id)}
            };

            // the positional $ operator acts as a placeholder for the first element that matches the query document
            var update = new UpdateDocument {
                {"$set", new BsonDocument("Attributes.$.Name", newAttribute.Name)}
            };

            _collection.Update(query, update,UpdateFlags.Multi);
        }


        public ImageSize SaveStreamToBlob(String fileName, Stream stream, String label)
        {
            var blobName = fileName.AppendSizeSufix(label); // 989754642-copac-pe-masina-o.jpg ("-o" from "original")
            CloudBlockBlob blob = AzureStorageContext.Instance.BlobImgContainer.GetBlockBlobReference(blobName);
            blob.Properties.ContentType = "image/" + Path.GetExtension(fileName).Replace(".", "");  //alfel Azure foloseste default "application/octet-stream"

            // Reset the Stream to the Beginning before upload ...altfel scrie un stream gol //http://social.msdn.microsoft.com/Forums/en-HK/windowsazuredata/thread/a9f8dae4-5636-43d0-b177-e631d9c8d92c
            stream.Seek(0, SeekOrigin.Begin);
            blob.UploadFromStream(stream);
            //stream.Close(); //nu uita sa inchizi stream-ul ...de fapt mai am nevoi de el...il inchid la final

            return new ImageSize()
            {
                Name = blob.Name,
                Size = blob.Properties.Length
            };
        }


        public List<ImageSize> SaveImage(String fileName, Stream stream)
        {
            var imageSizes = new List<ImageSize>();

            // convert stream to image
            Image originalImg = Image.FromStream(stream);
            var originalImgMaxSize = Math.Max(originalImg.Width, originalImg.Height);

            // for each defined size
            foreach (var desiredSize in Img.GetAvailableImageSizes().OrderBy(x=>x.MaxSize)) 
            {
                // resize only if originalImg is bigger than the currentDefinedSize
                if (originalImgMaxSize > desiredSize.MaxSize)
                {
                    ResizeAndSaveToBlob(originalImg, desiredSize, fileName, ref imageSizes);
                }
            }

            // save original file if < MaxAvailableSize
            var maxAvailableSize = Img.GetAvailableImageSizes().OrderBy(x => x.MaxSize).Last();
            if (originalImgMaxSize < maxAvailableSize.MaxSize)
            {
                var originalDesiredSize = new AvailableImageSize() { MaxSize = originalImgMaxSize, Label = "o", IsSquare=false };
                ResizeAndSaveToBlob(originalImg, originalDesiredSize, fileName, ref imageSizes);
            }

            originalImg.Dispose();
            stream.Dispose();

            return imageSizes;
        }

        public void DeleteImage(String imageNameWithoutExtension)
        {
            // delete all image sizes from Azure Blobs
            // imageSizeName = imageName + label (-q, -s, -l...etc)
            // get all blobs with a specified name prefix - http://gauravmantri.com/2012/11/28/storage-client-library-2-0-migrating-blob-storage-code/
            //var prefix = Path.GetFileNameWithoutExtension(imageName);
            IEnumerable<IListBlobItem> blobs = AzureStorageContext.Instance.BlobImgContainer.ListBlobs(imageNameWithoutExtension, false);
            foreach (var blob in blobs)
            {
                ((CloudBlockBlob)blob).DeleteAsync();
            }


            //// remove from DB (ok, dar nu foloses)
            //var query = new QueryDocument { 
            //    {"_id", ObjectId.Parse(productId)}
            //};

            //var update = new UpdateDocument {
            //    {"$pull", new BsonDocument("Images", new BsonDocument("Name", imageId))}
            //};

            //_collection.Update(query, update);
        }

        private void ResizeAndSaveToBlob(Image originalImg, AvailableImageSize desiredSize, String fileName, ref List<ImageSize> imageSizes)
        {
            // 1. resize image
            using (Image imageResized = ResizeImage.ResizeFromImage(originalImg, desiredSize))
            using (MemoryStream output = new MemoryStream())
            {
                imageResized.Save(output, ImageFormat.Jpeg); // converteste din imagine in stream http://stackoverflow.com/questions/7548028/stream-to-image-and-back

                // 2. save resized image to blob
                var blobObjResult = SaveStreamToBlob(fileName, output, desiredSize.Label);

                imageSizes.Add(new ImageSize()
                {
                    Name = blobObjResult.Name,
                    Label = desiredSize.Label,
                    Width = imageResized.Width.ToString(),
                    Height = imageResized.Height.ToString(),
                    Size = blobObjResult.Size// output.Length //sau blobObjResult.Size...cele 2 valori tb. sa fie identice
                });
            }
        }
    }


    public interface IProductRepository
    {
        void Create(Product item);
        IEnumerable<Product> GetAll();
        Product GetById(string itemId);
        void Update(Product item);
        void Delete(string itemId);

        void UpdateAttrName(Attribute newAttribute);
        List<ImageSize> SaveImage(String fileName, Stream fileStream);
        void DeleteImage(String imageNameWithoutExtension);
    }
}