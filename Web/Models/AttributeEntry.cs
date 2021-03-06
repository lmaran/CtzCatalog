﻿using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models
{
    public class AttributeEntry : TableEntity
    {
        public AttributeEntry()
        {
            base.PartitionKey = "p";
            //base.RowKey = RemainingTime.Seconds().ToString() + "_" + Guid.NewGuid().ToString(); //ca sa pot afisa ultimele "x" inregistrari...vezi "AzureTable Strategy.docx"
            base.RowKey = Guid.NewGuid().ToString(); //ca sa pot afisa ultimele "x" inregistrari...vezi "AzureTable Strategy.docx"
        }

        public AttributeEntry(string partitionKey, string rowKey)
        {
            base.PartitionKey = partitionKey;
            base.RowKey = rowKey;
        }

        public string Name { get; set; }
        //public string TranslatedName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string TypeDetails { get; set; }
    }
}