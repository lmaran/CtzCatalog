﻿using System;
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
    }
}