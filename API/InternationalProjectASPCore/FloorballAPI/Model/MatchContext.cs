using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FloorballAPI.Model
{
    public class MatchContext : DbContext
    {
        public MatchContext(DbContextOptions<MatchContext> options) : base(options)
        {
        }
        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Team> Teams { get; set; }
        //public DbSet<Data> Data { get; set; }
        //public DbSet<DataPoint> DataPoints { get; set; }
    }
}
