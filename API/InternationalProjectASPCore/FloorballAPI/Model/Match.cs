using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FloorballAPI.Model
{
    public class Match
    {
        public int ID { get; set; }
        [JsonIgnore]
        public List<Team> Teams { get; set; }
        [JsonIgnore]
        public List<Player> Players { get; set; }
        [JsonIgnore]
        public List<Data> Data { get; set; }
        public DateTime Start { get; set; }
        public bool Active { get; set; }
    }
}
