using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Helpers;

namespace Web.Models
{
    public class ProductEntry : TableEntity
    {
        public ProductEntry()
        {
            base.PartitionKey = "p";
            //base.RowKey = RemainingTime.Seconds().ToString() + "_" + Guid.NewGuid().ToString(); //ca sa pot afisa ultimele "x" inregistrari...vezi "AzureTable Strategy.docx"
            base.RowKey = Guid.NewGuid().ToString(); //ca sa pot afisa ultimele "x" inregistrari...vezi "AzureTable Strategy.docx"
        }

        public ProductEntry(string partitionKey, string rowKey)
        {
            base.PartitionKey = partitionKey;
            base.RowKey = rowKey;
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public string AttributeSetId { get; set; }
        public string AttributeSetName { get; set; }
        public string Attributes { get; set; }
    }
}