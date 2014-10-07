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
        public Customer Customer { get; set; }

    }
}