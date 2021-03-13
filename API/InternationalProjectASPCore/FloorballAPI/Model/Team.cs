using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FloorballAPI.Model
{
    public class Team
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public List<Player> Players { get; set; }
        public List<Match> Matches { get; set; }
    }
}
