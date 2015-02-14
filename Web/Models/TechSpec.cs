using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class TechSpec : Entity
    {
        public string Name { get; set; } // Ex: 'Laptop', 'Phone'...
        public string Description { get; set; }
        public List<Section> Sections { get; set; }
    }

    public class Section : Entity
    {
        public string Name { get; set; } // Ex: 'Processor', 'Memory'...
        public List<SpecItem> SpecItems { get; set; }
    }

    public class SpecItem : Entity
    {
        public string Name { get; set; } // Ex: (for Processor): 'CPU Type', 'Number of cores'...
        public bool UsedInSummary { get; set; }
        public List<String> Options { get; set; }
        public List<String> DefaultOptions { get; set; }
    }

}