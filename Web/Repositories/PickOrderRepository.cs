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
    public class PickOrderRepository : IPickOrderRepository
    {

        private readonly MongoCollection<PickOrder> _collection;

        public PickOrderRepository()
        {
            _collection = MongoContext.AppInstance.Database.GetCollection<PickOrder>(MongoConstants.Collections.PickOrders);
        }


        public String Create(PickOrder item)
        {
            _collection.Insert(item);

            // requires this line in Mongo Conventions file: 
            // cm.IdMemberMap.SetIdGenerator(StringObjectIdGenerator.Instance);
            // otherwise, Id remains null
            return item.Id;
        }

        public IEnumerable<PickOrder> GetAll()
        {
            return _collection.FindAll();
        }

        public PickOrder GetById(string itemId)
        {
            return _collection.FindOneById(ObjectId.Parse(itemId));
        }

        public void Update(PickOrder item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<PickOrder>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }


        // ***************** Related Services ****************

    }


    public interface IPickOrderRepository
    {
        String Create(PickOrder item);
        IEnumerable<PickOrder> GetAll();
        PickOrder GetById(String itemId);
        void Update(PickOrder item);
        void Delete(String itemId);
    }
}