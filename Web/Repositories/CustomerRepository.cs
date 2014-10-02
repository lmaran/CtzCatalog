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
    public class CustomerRepository : ICustomerRepository
    {

        private readonly MongoCollection<Customer> _collection;

        public CustomerRepository()
        {
            _collection = MongoContext.AppInstance.Database.GetCollection<Customer>(MongoConstants.Collections.Customers);
        }


        public void Create(Customer item)
        {
            _collection.Insert(item);
        }

        public IEnumerable<Customer> GetAll()
        {
            return _collection.FindAll();
        }

        public Customer GetById(string itemId)
        {
            return _collection.FindOneById(ObjectId.Parse(itemId));
        }

        public void Update(Customer item)
        {
            _collection.Save(item);
        }

        public void Delete(string itemId)
        {
            var query = Query<Customer>.EQ(x => x.Id, itemId);
            _collection.Remove(query);
        }


        // ***************** Related Services ****************

    }


    public interface ICustomerRepository
    {
        void Create(Customer item);
        IEnumerable<Customer> GetAll();
        Customer GetById(String itemId);
        void Update(Customer item);
        void Delete(String itemId);
    }
}