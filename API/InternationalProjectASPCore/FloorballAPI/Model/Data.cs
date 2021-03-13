using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FloorballAPI.Model
{
    public class Data
    {
        public Player Player { get; set; }
        public Match Match { get; set; }
        public int ID { get; set; }
        public int Hits { get; set; }
        public List<DataPoint> Accel { get; set; }
        public List<DataPoint> Linear { get; set; }
        public List<DataPoint> Orient { get; set; }
    }
}
