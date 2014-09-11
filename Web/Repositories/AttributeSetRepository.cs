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
using MongoDB.Driver;
using Web.Repositories.Mongo;
using MongoDB.Driver.Builders;
using MongoDB.Bson;
namespace Web.Repositories
{
    public class AttributeSetRepository : IAttributeSetRepository
    {
        private readonly MongoCollection<AttributeSet> _collection;

        public AttributeSetRepository()
        {
            _collection = MongoContext.AppInstance.Database.GetCollection<AttributeSet>(MongoConstants.Collections.AttributeSets);
        }


        public void Create(AttributeSet item)
        {
            _collection.Insert(item);
        }

        public IEnumerable<AttributeSet> GetAll()
        {
            return _collection.FindAll();
        }

        public AttributeSet GetById(string itemId)
        {
            return _collection.FindOneById(ObjectId.Parse(itemId));
        }

        public void Update(AttributeSet item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<AttributeSet>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }

    }


    public interface IAttributeSetRepository
    {
        void Create(AttributeSet item);
        IEnumerable<AttributeSet> GetAll();
        AttributeSet GetById(string itemId);
        void Update(AttributeSet item);
        void Delete(string itemId);
    }

}