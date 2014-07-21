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
    public class ProductController : ApiController
    {
        private readonly IProductRepository _productRepository;

        public ProductController()
        {
            this._productRepository = new ProductRepository();
        }

        public ProductController(IProductRepository productRepository)
        {
            this._productRepository = productRepository;
        }

        [HttpPost]
        [Route("api/products")]
        public void Post(ProductNew product)
        {
            _productRepository.Add(product);
        }

        [Route("api/products")]
        public IEnumerable<ProductViewModel> Get() //pk
        {
            return _productRepository.GetByPk();
        }

        [Route("api/products/{productId}")]
        public ProductViewModel Get(string productId) //pk
        {
            return _productRepository.GetById(productId);
        }

        [HttpPut]
        [Route("api/products")]
        public void Update(ProductViewModel product)
        {
            _productRepository.Update(product);
        }

        [HttpDelete]
        [Route("api/products/{productId}")]
        public void Delete(string productId)
        {
            _productRepository.Delete(productId);
        }

    }

}
