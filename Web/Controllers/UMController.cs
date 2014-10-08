using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;
using Web.Repositories;

namespace Web.Controllers
{
    [RoutePrefix("api/ums")]
    public class UMController : ApiController
    {
        private readonly IUMRepository _repository;
        private readonly IProductRepository _productRepository;

        public UMController(IUMRepository repository, IProductRepository productRepository)
        {
            this._repository = repository;
            this._productRepository = productRepository;
        }


        [HttpPost, Route]
        public void Post(UM item)
        {
            _repository.Create(item);
        }

        [HttpGet, Route]
        public IEnumerable<UM> GetAll()
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public UM Get(string itemId)
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(UM item)
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
