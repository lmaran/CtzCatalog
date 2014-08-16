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
    [RoutePrefix("api/attributesets")]
    public class AttributeSetController : ApiController
    {
        private readonly IAttributeSetRepository _repository;

        public AttributeSetController(IAttributeSetRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
        public void Post(AttributeSet item)
        {
            _repository.Add(item);
        }

        [HttpGet, Route("{lang?}")]
        public IEnumerable<AttributeSet> GetAll(string lang = null) //pk
        {
            return _repository.GetAll(lang);
        }

        [HttpGet, Route("{itemId}")]
        public AttributeSet Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(AttributeSet item)
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
