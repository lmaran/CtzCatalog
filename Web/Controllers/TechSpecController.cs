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
    [RoutePrefix("api/techspecs")]
    public class TechSpecController : ApiController
    {
        private readonly ITechSpecRepository _repository;

        public TechSpecController(ITechSpecRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
        public void Post(TechSpec item)
        {
            _repository.Create(item);
        }

        [HttpGet, Route]
        public IEnumerable<TechSpec> GetAll()
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public TechSpec Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(TechSpec item)
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
