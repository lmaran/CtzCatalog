using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;
using Web.Repositories;
using Attribute = Web.Models.Attribute; // Type alias

namespace Web.Controllers
{
    [RoutePrefix("api/attributes")]
    public class AttributeController : ApiController
    {
        private readonly IAttributeRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly IAttributeSetRepository _attributeSetRepository;

        public AttributeController(IAttributeRepository repository, IProductRepository productRepository, IAttributeSetRepository attributeSetRepository)
        {
            this._repository = repository;
            this._productRepository = productRepository;
            this._attributeSetRepository = attributeSetRepository;
        }


        [HttpPost, Route]
        public void Post(Attribute item)
        {
            _repository.Create(item);
        }

        [HttpGet, Route]
        public IEnumerable<Attribute> GetAll()
        {
            return _repository.GetAll();
        }

        [HttpGet, Route("{itemId}")]
        public Attribute Get(string itemId)
        {
            return _repository.GetById(itemId);
        }

        [HttpPut, Route]
        public void Update(Attribute item)
        {
            var oldItem = _repository.GetById(item.Id);

            _repository.Update(item);

            var comparer = new AttributeComparer();
            if (!comparer.Equals(item, oldItem))
            {
                // update AttributeSets
                _attributeSetRepository.UpdateAttr(item);

                if (item.Name != oldItem.Name)
                {
                    // update Products
                    _productRepository.UpdateAttrName(item);
                }
            }
        }

        [HttpDelete, Route("{itemId}")]
        public void Delete(string itemId)
        {
            _repository.Delete(itemId);
        }

    }

}
