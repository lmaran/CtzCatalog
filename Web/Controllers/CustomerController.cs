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
    [RoutePrefix("api/customers")]
    public class CustomerController : ApiController
    {
        private readonly ICustomerRepository _repository;

        public CustomerController(ICustomerRepository repository)
        {
            this._repository = repository;
        }


        [HttpPost, Route]
        public void Post(Customer item)
        {
            _repository.Add(item);
        }

        [HttpGet, Route]
        public IEnumerable<Customer> Get() //pk
        {
            return _repository.GetAll();
        }

        [HttpGet, Route]
        public Customer Get(string itemId) //pk
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(Customer item)
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
