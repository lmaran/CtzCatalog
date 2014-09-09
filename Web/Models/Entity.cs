using Newtonsoft.Json;

namespace Web.Models
{
    public abstract class Entity
    {
        //[JsonProperty]
        public string Id { get; set; }
    }
}