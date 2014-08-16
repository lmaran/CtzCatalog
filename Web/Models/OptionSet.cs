using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class OptionSet
    {
        public string OptionSetId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Options { get; set; }
    }
}