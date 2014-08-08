using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.ViewModels
{
    public class AttributeViewModel
    {
        public string AttributeId { get; set; }
        public string Name { get; set; }
        //public Dictionary<string,string> TranslatedName { get; set; }
        //public string TranslatedName { get; set; }
        public string Description { get; set; }

        public List<AttributeValue2> Attributes { get; set; }
    }

    public class AttributeValue2
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string DefaultValue { get; set; }
        //public Int32 DisplayOrder { get; set; }
    }
}