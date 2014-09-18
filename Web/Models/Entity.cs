using Newtonsoft.Json;

namespace Web.Models
{
    public abstract class Entity
    {
        // the problem: 
        // the WebApi JSON result that we get from MongoDB (deserialized via JSON.NET) has 
        // base class properties ('id - in this case) serialized after inheriting class properties:

        //{
        //    name: "aa",
        //    code: "ss",
        //    attributeSetId: "541075fdbb6023e3cb1e3bf3",
        //    attributeSetName: "Accesory",
        //    attributes: [
        //        {
        //            name: "Lengths",
        //            value: "6.5m",
        //            id: "540df9bebb6023e3cb1e3bf0"
        //        },
        //        {
        //            name: "Color",
        //            values: [
        //                "Red",
        //                "Blue"
        //            ],
        //            id: "540de00bbb6023e3cb1e3bef"
        //        }
        //    ],
        //    id: "5411f8ac9cc8511448df3888"
        //}


        // the result:
        //{
        //    id: "5411f8ac9cc8511448df3888",
        //    name: "aa",
        //    code: "ss",
        //    attributeSetId: "541075fdbb6023e3cb1e3bf3",
        //    attributeSetName: "Accesory",
        //    attributes: [
        //        {
        //            id: "540df9bebb6023e3cb1e3bf0",
        //            name: "Lengths",
        //            value: "6.5m"
        //        },
        //        {
        //            id: "540de00bbb6023e3cb1e3bef",
        //            name: "Color",
        //            values: [
        //                "Red",
        //                "Blue"
        //            ]
        //        }
        //    ]
        //}

        // remarks: 
        // 1. XML serialization does not have such a problem
        // 2. this solution just produce a more human readable content; does not affect the app. logic

        // http://stackoverflow.com/a/14035431/2726725
        // http://stackoverflow.com/questions/19909168/json-net-serialise-base-class-members-first
        // 

        // By default any property without an 'Order' setting will be given an order of -1
        [JsonProperty(Order=-2)]
        public string Id { get; set; }
    }
}