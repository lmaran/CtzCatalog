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

namespace Web.Controllers
{
    [RoutePrefix("api/products")]
    public class ProductController : ApiController
    {
        private readonly IProductRepository _repository;
        //private readonly IOptimisticDataStore _store;
        //private readonly IUniqueIdGenerator _generator;

        //public ProductController(IProductRepository repository, IOptimisticDataStore store)
        public ProductController(IProductRepository repository)
        //public ProductController(IProductRepository repository, IUniqueIdGenerator generator)
        {
            this._repository = repository;
            //this._store = store;
            //this._generator = generator;
        }


        [HttpPost, Route]
         public void Post(Product item)
        {
            _repository.Add(item);
        }

        [HttpGet, Route]
        public IEnumerable<Product> Get() //pk
        {
            return _repository.GetAll();
        }

        //[HttpGet, Route]
        //public long Get() //pk
        //{

        //    //var connString = ConfigurationManager.ConnectionStrings["CortizoAzureStorage"].ConnectionString;
        //    //var storageAccount = CloudStorageAccount.Parse(connString);

        //    //var _store = new BlobOptimisticDataStore(storageAccount, "testContainer");
        //    //var generator = new UniqueIdGenerator(_store) { BatchSize = 3 };
            
        //    var generatedId = _generator.NextId("test");

        //    return generatedId;

        //}

        [HttpGet, Route("{itemId}")]
        public Product Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(Product item)
        {
            _repository.Update(item);
        }

        [HttpDelete, Route("{itemId}")]
        public void Delete(string itemId)
        {
            _repository.Delete(itemId);
        }

    }


    //http://chinmaylokesh.wordpress.com/2012/02/25/c-thread-safe-lazy-initialized-net-4-0-lazy-generic-singleton/
    public class Singleton<T> where T : class, new()
    {
        Singleton() { }

        private static readonly Lazy<T> instance = new Lazy<T>(() => new T());

        public static T UniqueInstance
        {
            get { return instance.Value; }
        }
    }

}
