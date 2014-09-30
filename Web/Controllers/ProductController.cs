using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;
using Web.Repositories;

using SnowMaker;
using System.Configuration;
using Microsoft.WindowsAzure.Storage;
using System.Threading.Tasks;
using System.IO;
using Web.Helpers;
using System.Web;

namespace Web.Controllers
{
    [RoutePrefix("api/products")]
    public class ProductController : ApiController
    {
        private readonly IProductRepository _repository;

        public ProductController(IProductRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
         public void Post(Product item)
        {
            _repository.Create(item);
        }

        [HttpGet, Route]
        public IEnumerable<Product> Get() //pk
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public Product Get(String itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(Product item)
        {
            _repository.Update(item);
        }

        [HttpDelete, Route("{itemId}")]
        public void Delete(String itemId)
        {
            _repository.Delete(itemId);
        }

        // *************** Related actions ******************

        [HttpPost, Route("images")]
        public async Task<HttpResponseMessage> Post()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType); 
            }

            var streamProvider = new MultipartMemoryStreamProvider();
            Stream fileStream = null;
            String fileName = "";

            await Request.Content.ReadAsMultipartAsync(streamProvider);

            foreach (HttpContent content in streamProvider.Contents) // cu acelasi "POST", odata cu fisierul pot fi transmisi si alti parametri...exista mai multe sectiuni de tipul form-data din care fisierul ocupa doar o singura sectiune.
            {
                var headers = content.Headers;
                if (headers.ContentDisposition.FileName != null) // file
                {
                    fileName = HttpUtility.UrlDecode(headers.ContentDisposition.FileName); // Boston%20City.jpg --> Boston City.jpg
                    fileName = fileName.Replace("\"", string.Empty).GenerateSlugForFilename(); // Chrome submits files in quotation marks which get treated as part of the filename and get escaped
                    fileName = RemainingTime.Seconds().ToString().PadLeft(9, '0') + "-" + fileName; // all sizes for the same file have the same prefix
                    fileStream = content.ReadAsStreamAsync().Result;
                }
                //else //form field
            }

            // save file to Blob
            List<ImageSize> imageSizes = _repository.SaveImage(fileName, fileStream);

            // create metadata
            var imageMeta = new ImageMeta();
            imageMeta.RootUrl = "http://cortizo.blob.core.windows.net/images";
            imageMeta.Name = fileName;
            imageMeta.Sizes = imageSizes;

            return Request.CreateResponse(HttpStatusCode.OK, imageMeta);
        }

        [HttpDelete, Route("images/{itemId}")] // itemId = 'imageNameWithoutExtension'
        public void DeleteImage(String itemId)
        {
            _repository.DeleteImage(itemId);
        }

    }


}
