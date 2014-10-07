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
    [RoutePrefix("api/pickOrders")]
    public class PickOrderController : ApiController
    {
        private readonly IPickOrderRepository _repository;

        public PickOrderController(IPickOrderRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
        public void Post(PickOrder item)
        {
            _repository.Create(item);
        }

        [HttpGet, Route]
        public IEnumerable<PickOrder> Get()
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public PickOrder Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(PickOrder item)
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
