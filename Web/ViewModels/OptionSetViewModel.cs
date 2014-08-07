using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.ViewModels
{
    public class OptionSetViewModel
    {
        public string OptionSetId { get; set; }
        public string Name { get; set; }
        //public Dictionary<string,string> TranslatedName { get; set; }
        //public string TranslatedName { get; set; }
        public string Description { get; set; }

        public List<Option> Options { get; set; }
    }

    public class Option
    {
        public string Name { get; set; }
        public string Description { get; set; }
        // public string Value { get; set; }  - I don't need it
        public Int32 DisplayOrder { get; set; }
    }
}