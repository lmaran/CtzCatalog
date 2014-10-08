using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class Attribute : Entity
    {

        public string Name { get; set; }
        //public Dictionary<string,string> TranslatedName { get; set; }
        //public string TranslatedName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; } // Text / SingleOption / MultiOptions
        public List<string> Options { get; set; }

        // without nullable, when we load from DB we receive an object with this property set to false (default for boolean), even if we don't have this field in DB at all
        // details: http://stackoverflow.com/a/4895977/2726725
        public bool? AllowCustomValues { get; set; } // allow to add value(s) that are not in the Options list

        public string DefaultValue { get; set; }
        public List<string> DefaultValues { get; set; }
    }

    // http://forums.asp.net/t/1977862.aspx?Comparing+two+different+complex+objects+in+c+
    public class AttributeComparer : IEqualityComparer<Attribute>
    {
        public bool Equals(Attribute x, Attribute y)
        {
            if (Object.ReferenceEquals(x, y)) return true;
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null)) return false;

            return x.Id == y.Id
                && x.Name == y.Name
                && x.Description == y.Description
                && x.Type == y.Type
                && Enumerable.SequenceEqual(x.Options, y.Options)
                && x.DefaultValue == y.DefaultValue
                && Enumerable.SequenceEqual(x.DefaultValues, y.DefaultValues);
        }

        public int GetHashCode(Attribute attribute)
        {
            if (Object.ReferenceEquals(attribute, null)) return 0;

            //Get hash code for each field. 
            int hashId = attribute.Id == null ? 0 : attribute.Id.GetHashCode();
            int hashName = attribute.Name == null ? 0 : attribute.Name.GetHashCode();
            int hashDescription = attribute.Description == null ? 0 : attribute.Description.GetHashCode();
            int hashType = attribute.Type == null ? 0 : attribute.Type.GetHashCode();
            int hashOptions = attribute.Options == null ? 0 : attribute.Options.GetHashCode();
            int hashDefaultValue = attribute.DefaultValue == null ? 0 : attribute.DefaultValue.GetHashCode();
            int hashDefaultValues = attribute.DefaultValues == null ? 0 : attribute.DefaultValues.GetHashCode();

            //Calculate the hash code. 
            return hashId ^ hashName ^ hashDescription ^ hashType ^ hashOptions ^ hashDefaultValue ^ hashDefaultValues;

            // return attribute.GetHashCode();
        }
    }
}