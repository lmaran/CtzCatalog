﻿using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class PickOrderNew
    {
        public string Name { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
    }
}