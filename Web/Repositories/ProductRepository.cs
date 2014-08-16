using Web.Helpers;
using Web.Models;
using AutoMapper;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;

namespace Web.Repositories
{
    public class ProductRepository : TableStorage<ProductEntry>, IProductRepository
    {
        public ProductRepository()
            : base(tableName: "Products")
        {
        }

        public void Add(Product item)
        {
            //var entity = new DynamicTableEntity();
            //entity.Properties["Name"] = new EntityProperty(item.Name);
            //entity.Properties["Description"] = new EntityProperty(item.Description);
            //entity.Properties["AttributeSetId"] = new EntityProperty(item.AttributeSetId);
            //entity.Properties["AttributeSetName"] = new EntityProperty(item.AttributeSetName);
            //entity.Properties["Attributes"] = new EntityProperty(item.Attributes);
            //entity.PartitionKey = "p";
            //entity.RowKey = Guid.NewGuid().ToString();

            // met.2
            Mapper.CreateMap<Product, ProductEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.Name.GenerateSlug()))
                .ForMember(dest => dest.PartitionKey, opt => opt.UseValue("p"));
            var entity = Mapper.Map<Product, ProductEntry>(item);

            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<Product> GetAll()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<ProductEntry, Product>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<ProductEntry>, List<Product>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }

        public Product GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<ProductEntry, Product>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.RowKey));

            return Mapper.Map<ProductEntry, Product>(entry);
        }

        public void Update(Product item)
        {
            Mapper.CreateMap<Product, ProductEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.PartitionKey, opt=> opt.UseValue("p"));

            var entity = Mapper.Map<Product, ProductEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            var item = new ProductEntry();
            item.PartitionKey = "p";
            item.RowKey = itemId;
            this.Delete(item);
        }

    }


    public interface IProductRepository : ITableStorage<ProductEntry>
    {
        void Add(Product item);
        IEnumerable<Product> GetAll();
        Product GetById(string itemId);
        void Update(Product item);
        void Delete(string itemId);
    }
}