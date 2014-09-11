using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class Attribute : Entity
    {

        //public string AttributeId { get; set; }
        public string Name { get; set; }
        //public Dictionary<string,string> TranslatedName { get; set; }
        //public string TranslatedName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; } // Text / SingleOption / MultiOptions
        public List<string> Options { get; set; }
        //public bool AllowMultiple { get; set; } // allow to select multiple values from list

        // without nullable, when we load from DB we receive an object with this property set to false (default for boolean), even if we don't have this field in DB at all
        // details: http://stackoverflow.com/a/4895977/2726725
        public bool? AllowCustomValues { get; set; } // allow to add value(s) that are not in the Options list

        public string DefaultValue { get; set; }
    }
}