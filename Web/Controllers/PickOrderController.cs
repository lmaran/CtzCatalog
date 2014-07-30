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
    //[RoutePrefix("api/products")]
    public class PickOrderController : ApiController
    {
        private readonly IPickOrderRepository _pickOrderRepository;

        public PickOrderController()
        {
            this._pickOrderRepository = new PickOrderRepository();
        }

        public PickOrderController(IPickOrderRepository pickOrderRepository)
        {
            this._pickOrderRepository = pickOrderRepository;
        }

        [HttpPost]
        [Route("api/pickOrders")]
        public void Post(PickOrderNew item)
        {
            _pickOrderRepository.Add(item);
        }

        [Route("api/pickOrders")]
        public IEnumerable<PickOrderViewModel> Get() //pk
        {
            return _pickOrderRepository.GetAll();
        }

        [Route("api/pickOrders/{itemId}")]
        public PickOrderViewModel Get(string itemId) //pk
        {
            return _pickOrderRepository.GetById(itemId);
        }

        [HttpPut]
        [Route("api/pickOrders")]
        public void Update(PickOrderViewModel item)
        {
            _pickOrderRepository.Update(item);
        }

        [HttpDelete]
        [Route("api/pickOrders/{itemId}")]
        public void Delete(string itemId)
        {
            _pickOrderRepository.Delete(itemId);
        }

    }

}
