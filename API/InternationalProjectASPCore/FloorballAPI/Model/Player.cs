using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FloorballAPI.Model
{
    public class Player
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public int ID { get; set; }
        public int TotalHits { get; set; }
        public string Team { get; set; }
    }
}
