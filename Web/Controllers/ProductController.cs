using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
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

        [Route("api/products")]
        public IEnumerable<ProductViewModel> Get() //pk
        {
            return _productRepository.GetByPk();
        }
    }
}
