﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class Product
    {
        public string ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public string AttributeSetId { get; set; }
        public string AttributeSetName { get; set; }
        public string Attributes { get; set; }
    }
}