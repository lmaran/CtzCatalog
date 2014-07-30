using Web.Helpers;
using Web.Models;
using Web.ViewModels;
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

        public void Add(CustomerNew item)
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

        public IEnumerable<CustomerViewModel> GetAll()
        {
            var filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, "p");
            var entitiesTable = this.ExecuteQuery(filter);

            // automapper: copy "entitiesTable" to "entitiesVM"
            Mapper.CreateMap<CustomerEntry, CustomerViewModel>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.RowKey));


            var entitiesVM = Mapper.Map<List<CustomerEntry>, List<CustomerViewModel>>(entitiesTable.ToList()); //neaparat cu ToList()

            return entitiesVM;
        }

        public CustomerViewModel GetById(string itemId)
        {
            var entry = this.Retrieve("p", itemId);

            Mapper.CreateMap<CustomerEntry, CustomerViewModel>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.RowKey));

            return Mapper.Map<CustomerEntry, CustomerViewModel>(entry);
        }

        public void Update(CustomerViewModel item)
        {
            Mapper.CreateMap<CustomerViewModel, CustomerEntry>()
                .ForMember(dest => dest.RowKey, opt => opt.MapFrom(src => src.CustomerId))
                .ForMember(dest => dest.PartitionKey, opt=> opt.UseValue("p"));

            var entity = Mapper.Map<CustomerViewModel, CustomerEntry>(item);

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
        void Add(CustomerNew item);
        IEnumerable<CustomerViewModel> GetAll();
        CustomerViewModel GetById(string itemId);
        void Update(CustomerViewModel item);
        void Delete(string itemId);
    }
}