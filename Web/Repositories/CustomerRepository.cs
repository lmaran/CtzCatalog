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
    public class CustomerRepository : TableStorage<CustomerEntry>, ICustomerRepository
    {
        public CustomerRepository()
            : base(tableName: "Customers")
        {
        }

        public void Add(Customer item)
        {
            var entity = new DynamicTableEntity();

            entity.Properties["Name"] = new EntityProperty(item.Name);
            entity.Properties["Address"] = new EntityProperty(item.Address);
            entity.Properties["Phone"] = new EntityProperty(item.Phone);
            entity.Properties["Description"] = new EntityProperty(item.Description);
            entity.PartitionKey = "p";
            entity.RowKey = Guid.NewGuid().ToString();

            // entity.ETag = "*"; // mandatory for <merge>
            // var operation = TableOperation.Merge(entity);
            var operation = TableOperation.Insert(entity);
            Table.Execute(operation);
        }

        public IEnumerable<Customer> GetAll()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<CustomerEntry, Customer>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<CustomerEntry>, List<Customer>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }

        public Customer GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<CustomerEntry, Customer>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.RowKey));

            return Mapper.Map<CustomerEntry, Customer>(entry);
        }

        public void Update(Customer item)
        {
            Mapper.CreateMap<Customer, CustomerEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.PartitionKey, opt=> opt.UseValue("p"));

            var entity = Mapper.Map<Customer, CustomerEntry>(item);

            entity.ETag = "*"; // mandatory for <replace>
            var operation = TableOperation.Replace(entity);
            Table.Execute(operation);
        }

        public void Delete(string itemId)
        {
            var item = new CustomerEntry();
            item.PartitionKey = "p";
            item.RowKey = itemId;
            this.Delete(item);
        }

    }


    public interface ICustomerRepository : ITableStorage<CustomerEntry>
    {
        void Add(Customer item);
        IEnumerable<Customer> GetAll();
        Customer GetById(string itemId);
        void Update(Customer item);
        void Delete(string itemId);
    }
}