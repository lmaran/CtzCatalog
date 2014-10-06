using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class Product : Entity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string UM { get; set; }
        public string AttributeSetId { get; set; }
        public string AttributeSetName { get; set; }
        public List<ProductAttribute> Attributes { get; set; }
        public List<ImageMeta> Images { get; set; }
        public List<RelatedProduct> RelatedProducts { get; set; }
    }

    public class ProductAttribute : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Value { get; set; }
        public List<string> Values { get; set; }
    }

    public class RelatedProduct : Entity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string AttributeSetId { get; set; }
        public string AttributeSetName { get; set; }
        public List<ImageMeta> Images { get; set; }
    }

    // http://forums.asp.net/t/1977862.aspx?Comparing+two+different+complex+objects+in+c+
    public class RelatedProductComparer : IEqualityComparer<RelatedProduct>
    {
        public bool Equals(RelatedProduct x, RelatedProduct y)
        {
            if (Object.ReferenceEquals(x, y)) return true;
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null)) return false;

            return x.Id == y.Id;
                //&& x.Name == y.Name
                //&& x.Code == y.Code
                //&& x.Description == y.Description
                //&& x.AttributeSetId == y.AttributeSetId
                //&& Enumerable.SequenceEqual(x.Options, y.Options)
                //&& x.DefaultValue == y.DefaultValue
                //&& Enumerable.SequenceEqual(x.DefaultValues, y.DefaultValues);
        }

        public int GetHashCode(RelatedProduct item)
        {
            if (Object.ReferenceEquals(item, null)) return 0;

            //Get hash code for each field. 
            int hashId = item.Id == null ? 0 : item.Id.GetHashCode();
            //int hashName = attribute.Name == null ? 0 : attribute.Name.GetHashCode();
            //int hashDescription = attribute.Description == null ? 0 : attribute.Description.GetHashCode();
            //int hashType = attribute.Type == null ? 0 : attribute.Type.GetHashCode();
            //int hashOptions = attribute.Options == null ? 0 : attribute.Options.GetHashCode();
            //int hashDefaultValue = attribute.DefaultValue == null ? 0 : attribute.DefaultValue.GetHashCode();
            //int hashDefaultValues = attribute.DefaultValues == null ? 0 : attribute.DefaultValues.GetHashCode();

            //Calculate the hash code. 
            //return hashId ^ hashName ^ hashDescription ^ hashType ^ hashOptions ^ hashDefaultValue ^ hashDefaultValues;
            return hashId;

            // return attribute.GetHashCode();
        }
    }

    public static class ProductExtension {

        public static RelatedProduct ConvertToRelatedProduct(this Product product){
            // RelatedProduct is just a subset of a regular Product
            Mapper.CreateMap<Product, RelatedProduct>();
            var relatedProduct = Mapper.Map<Product, RelatedProduct>(product);

            return relatedProduct;
        }
    }
}