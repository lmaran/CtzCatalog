using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;
using Web.Repositories;
using Attribute = Web.Models.Attribute; // Type alias

namespace Web.Controllers
{
    [RoutePrefix("api/attributes")]
    public class AttributeController : ApiController
    {
        private readonly IAttributeRepository _repository;

        public AttributeController(IAttributeRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
        public void Post(Attribute item)
        {
            _repository.Create(item);
        }

        [HttpGet, Route]
        public IEnumerable<Attribute> GetAll()
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public Attribute Get(string itemId)
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(Attribute item)
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
