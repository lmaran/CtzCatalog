using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;
using Web.Repositories;
using Web.ViewModels;

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
         public void Post(ProductNew item)
        {
            _repository.Add(item);
        }

        [HttpGet, Route]
        public IEnumerable<ProductViewModel> Get() //pk
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public ProductViewModel Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(ProductViewModel item)
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
