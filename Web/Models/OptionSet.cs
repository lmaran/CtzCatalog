using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class OptionSet
    {
        public ObjectId Id { get; set; }
        public string OptionSetId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string Options { get; set; }
        public List<Option> Options { get; set; }
    }

    public class Option
    {
        public string OptionId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
    }
}