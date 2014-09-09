using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;
using Web.Repositories;

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


        //[HttpPost, Route]
        ////public void Post(OptionSet item)
        ////{
        ////    _repository.Add(item);
        ////}
        //public void Post(JObject item)
        //{
        //    _repository.AddAsJson(item);
        //}

        [HttpGet, Route("{lang?}")]
        public IEnumerable<OptionSet> GetAll(string lang = null) //pk
        {
            return _repository.GetAll(lang);
        }
        ////public IEnumerable<OptionSet> GetAll(string lang = null) //pk
        ////{
        ////    return _repository.GetAll(lang);
        ////}
        //public IEnumerable<JObject> GetAll(string lang = null) //pk
        //{
        //    return _repository.GetAllAsJson(lang);
        //}

        //[HttpGet, Route("{itemId}")]
        ////public OptionSet Get(string itemId) //pk
        ////{
        ////    return _repository.GetById(itemId);
        ////}
        //public JObject Get(string itemId) //pk
        //{
        //    return _repository.GetByIdAsJson(itemId);
        //}

        //[HttpPut, Route]
        ////public void Update(OptionSet item)
        ////{
        ////    _repository.Update(item);
        ////}
        //public void Update(JObject item)
        //{
        //    _repository.UpdateAsJson(item);
        //}

        //[HttpDelete, Route("{itemId}")]
        //public void Delete(string itemId)
        //{
        //    _repository.Delete(itemId);
        //}

    }

}
