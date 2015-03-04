using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class PickOrder:Entity
    {
        public PickOrder()
        {
            this.CreatedOn = DateTime.UtcNow;
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public CustomerOnOrder Customer { get; set; }
        public List<OrderLine> OrderLines { get; set; }

    }

    public class CustomerOnOrder : Entity
    {
        public string Name { get; set; }
    }

    public class OrderLine : Entity
    {
        public ProductOnOrder Product { get; set; }
        public decimal Quantity { get; set; }
        public string UoM { get; set; }
    }

    public class ProductOnOrder : Entity
    {
        public string Category { get; set; } // Profile
        public string Type { get; set; } // FBT
        public string Series { get; set; } // S3500CE
        public string Code { get; set; } // 3622
        public string Name { get; set; } // Toc rotund 61/27/47 mm
        public string Color1 { get; set; } // alb
        public string Color2 { get; set; }
    }
}