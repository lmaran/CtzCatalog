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
    public class UMRepository : IUMRepository
    {

        private readonly MongoCollection<UM> _collection;

        public UMRepository()
        {
            _collection = MongoContext.AppInstance.Database.GetCollection<UM>(MongoConstants.Collections.UMs);
        }


        public void Create(UM item)
        {
            _collection.Insert(item);
        }

        public IEnumerable<UM> GetAll()
        {
            return _collection.FindAll();
        }

        public UM GetById(string itemId)
        {
            return _collection.FindOneById(ObjectId.Parse(itemId));
        }

        public void Update(UM item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<UM>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }


        // ***************** Related Services ****************

    }


    public interface IUMRepository
    {
        void Create(UM item);
        IEnumerable<UM> GetAll();
        UM GetById(String itemId);
        void Update(UM item);
        void Delete(String itemId);
    }
}