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
    [RoutePrefix("api/attributesets")]
    public class AttributeSetController : ApiController
    {
        private readonly IAttributeSetRepository _repository;

        public AttributeSetController(IAttributeSetRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost]
        [Route("")]
        public void Post(AttributeSetNew item)
        {
            _repository.Add(item);
        }

        [Route("{lang?}")]
        public IEnumerable<AttributeSetViewModel> GetAll(string lang = null) //pk
        {
            return _repository.GetAll(lang);
        }

        [Route("{itemId}")]
        public AttributeSetViewModel Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut]
        [Route("")]
        public void Update(AttributeSetViewModel item)
        {
            _repository.Update(item);
        }

        [HttpDelete]
        [Route("{itemId}")]
        public void Delete(string itemId)
        {
            _repository.Delete(itemId);
        }

    }

}
