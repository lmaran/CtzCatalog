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
    [RoutePrefix("api/pickOrders")]
    public class PickOrderController : ApiController
    {
        private readonly IPickOrderRepository _repository;

        public PickOrderController(IPickOrderRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost]
        [Route("")]
        public void Post(PickOrderNew item)
        {
            _repository.Add(item);
        }

        [Route("")]
        public IEnumerable<PickOrderViewModel> Get() //pk
        {
            return _repository.GetAll();
        }

        [Route("{itemId}")]
        public PickOrderViewModel Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut]
        [Route("")]
        public void Update(PickOrderViewModel item)
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
