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

        
        // ***************** services ****************
        
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
    }


    public interface IProductRepository
    {
        void Create(Product item);
        IEnumerable<Product> GetAll();
        Product GetById(string itemId);
        void Update(Product item);
        void Delete(string itemId);

        void UpdateAttrName(Attribute newAttribute);
    }
}