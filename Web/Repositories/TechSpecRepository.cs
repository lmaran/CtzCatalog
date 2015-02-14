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
    public class TechSpecRepository : ITechSpecRepository
    {

        private readonly MongoCollection<TechSpec> _collection;

        public TechSpecRepository()
        {
            _collection = MongoContext.AppInstance.Database.GetCollection<TechSpec>(MongoConstants.Collections.TechSpecs);
        }


        public String Create(TechSpec item)
        {
            _collection.Insert(item);

            // requires this line in Mongo Conventions file: 
            // cm.IdMemberMap.SetIdGenerator(StringObjectIdGenerator.Instance);
            // otherwise, Id remains null
            return item.Id;
        }

        public IEnumerable<TechSpec> GetAll()
        {
            return _collection.FindAll();
        }

        public TechSpec GetById(string itemId)
        {
            return _collection.FindOneById(ObjectId.Parse(itemId));
        }

        public void Update(TechSpec item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<TechSpec>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }


        // ***************** Related Services ****************

    }


    public interface ITechSpecRepository
    {
        String Create(TechSpec item);
        IEnumerable<TechSpec> GetAll();
        TechSpec GetById(String itemId);
        void Update(TechSpec item);
        void Delete(String itemId);
    }
}