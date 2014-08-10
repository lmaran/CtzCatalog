using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.ViewModels;

namespace Web.Models
{
    public class AttributeSetNew
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<AttributeValue> Attributes { get; set; }
    }
}