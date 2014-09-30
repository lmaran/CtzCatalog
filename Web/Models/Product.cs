using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class Product : Entity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string UM { get; set; }
        public string AttributeSetId { get; set; }
        public string AttributeSetName { get; set; }
        public List<ProductAttribute> Attributes { get; set; }
        public List<ImageMeta> Images { get; set; }
    }

    public class ProductAttribute : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Value { get; set; }
        public List<string> Values { get; set; }
    }
}