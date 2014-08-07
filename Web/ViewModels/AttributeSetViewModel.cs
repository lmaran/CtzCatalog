using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.ViewModels
{
    public class AttributeSetViewModel
    {
        public string AttributeSetId { get; set; }
        public string Name { get; set; }
        //public Dictionary<string,string> TranslatedName { get; set; }
        //public string TranslatedName { get; set; }
        public string Description { get; set; }

        public List<AttributeValue> Attributes { get; set; }
    }

    public class AttributeValue
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string DefaultValue { get; set; }
        //public Int32 DisplayOrder { get; set; }
    }
}