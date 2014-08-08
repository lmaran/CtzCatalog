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
    [RoutePrefix("api/attributes")]
    public class AttributeController : ApiController
    {
        private readonly IAttributeRepository _repository;

        public AttributeController(IAttributeRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost]
        [Route("")]
        public void Post(AttributeNew item)
        {
            _repository.Add(item);
        }

        [Route("{lang?}")]
        public IEnumerable<AttributeViewModel> GetAll(string lang = null) //pk
        {
            return _repository.GetAll(lang);
        }

        [Route("{itemId}")]
        public AttributeViewModel Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut]
        [Route("")]
        public void Update(AttributeViewModel item)
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
