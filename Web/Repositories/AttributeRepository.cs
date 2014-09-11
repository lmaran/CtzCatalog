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
using System.Linq.Expressions;
using Attribute = Web.Models.Attribute; // Type alias
using MongoDB.Driver;
using Web.Repositories.Mongo;
using MongoDB.Driver.Builders;
using MongoDB.Bson; 
namespace Web.Repositories
{
    public class AttributeRepository : IAttributeRepository
    {
        private readonly MongoCollection<Attribute> _collection;

        public AttributeRepository() {
            _collection = MongoContext.AppInstance.Database.GetCollection<Attribute>(MongoConstants.Collections.Attributes);
        }


        public void Create(Attribute item)
        {
            _collection.Insert(item);
        }

        public IEnumerable<Attribute> GetAll()
        {
            return _collection.FindAll();
        }

        public Attribute GetById(string itemId)
        {
            return _collection.FindOneById(ObjectId.Parse(itemId));
        }

        public void Update(Attribute item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<Attribute>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }

    }


    public interface IAttributeRepository
    {
        void Create(Attribute item);
        IEnumerable<Attribute> GetAll();
        Attribute GetById(string itemId);
        void Update(Attribute item);
        void Delete(string itemId);
    }

}