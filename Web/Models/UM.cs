using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class UM : Entity
    {
        public string Name { get; set; }
        public string PluralName { get; set; }

        // Base: m, kg, buc
        // Aggregate: rola=f(m), bara=f(m), cutie=f(buc, m, kg)
        public string Type { get; set; } // Base or Aggregate
        
        // for Aggregate Types only
        public List<ShortUMItem> BaseUMItems { get; set; }
        public ShortUMItem DefaultBaseUM { get; set; }
        public Decimal? DefaultValue { get; set; }
        public List<Decimal?> Values { get; set; }
    }

    public class ShortUMItem : Entity
    {
        public string Name { get; set; }
        public string PluralName { get; set; }
    }
}