using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.ViewModels
{
    public class PickOrderViewModel
    {
        public string PickOrderId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
    }
}