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

    }


    public interface IProductRepository
    {
        void Create(Product item);
        IEnumerable<Product> GetAll();
        Product GetById(string itemId);
        void Update(Product item);
        void Delete(string itemId);
    }
}