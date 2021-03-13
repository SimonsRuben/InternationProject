using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FloorballAPI.Model
{
    public class Player
    {
        public string Name { get; set; }
        public int ID { get; set; }
        public int Icon { get; set; }
        public List<Match> Matches { get; set; }
        [JsonIgnore]
        public Team Team { get; set; }

        //[JsonIgnore]
        //public List<Data> Data { get; set; }

    }
}
