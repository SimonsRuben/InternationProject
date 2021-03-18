using FloorballAPI.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FloorballAPI
{
    public class DBinitializer
    {
        public static void Initialize(MatchContext context)
        {
            context.Database.EnsureCreated();
            
            if (!context.Players.Any())
            {
                var player = new Player()
                {
                    Name = "Bob",
                    Age = 20,
                    TotalHits = 40,
                    Team = "Red kangaroos"
                };
                context.Players.Add(player);
                context.SaveChanges();
            }
        }
    }
}
