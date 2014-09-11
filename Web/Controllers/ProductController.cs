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


}
