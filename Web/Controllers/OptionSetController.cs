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
    [RoutePrefix("api/optionsets")]
    public class OptionSetController : ApiController
    {
        private readonly IOptionSetRepository _repository;

        public OptionSetController(IOptionSetRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
        public void Post(OptionSetNew item)
        {
            _repository.Add(item);
        }

        [HttpGet, Route("{lang?}")]
        public IEnumerable<OptionSetViewModel> GetAll(string lang = null) //pk
        {
            return _repository.GetAll(lang);
        }

        [HttpGet, Route("{itemId}")]
        public OptionSetViewModel Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(OptionSetViewModel item)
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
