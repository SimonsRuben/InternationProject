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
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            
            if (!context.Matches.Any())
            {
                var d = new DataPoint()
                {
                    X = 1,
                    Y = 1,
                    Z = 2,
                    Time = DateTime.Now
                };
                var d2 = new DataPoint()
                {
                    X = 3,
                    Y = 9,
                    Z = 2,
                    Time = DateTime.Now
                };
                var d3 = new DataPoint()
                {
                    X = 1,
                    Y = 6,
                    Z = 2,
                    Time = DateTime.Now
                };
                

                var player = new Player()
                {
                    Name = "Bob",
                    Matches = new List<Match>()
                };
                
                var player2 = new Player()
                {
                    Name = "Bob2",
                    Matches = new List<Match>()
                };
                
                var team = new Team()
                {
                    Name = "Red Kangaroos",
                    Players = new List<Player>()
                };
                var team2 = new Team()
                {
                    Name = "Blue Pandas",
                    Players = new List<Player>()
                };
                team.Players.Add(player);
                team2.Players.Add(player2);
                var match1 = new Match()
                {
                    Start = DateTime.Now,
                    Players = new List<Player>(),
                    Teams = new List<Team>(),
                    Data = new List<Data>()
                };
                var match2 = new Match()
                {
                    Start = DateTime.Now,
                    Players = new List<Player>(),
                    Teams = new List<Team>(),
                    Data = new List<Data>()
                };
                var data = new Data()
                {
                    Accel = new List<DataPoint>(),
                    Linear = new List<DataPoint>(),
                    Orient = new List<DataPoint>(),
                    Match = match1,
                    Player = player,
                    Hits = 4
                };
                data.Accel.Add(d);
                data.Accel.Add(d2);
                data.Linear.Add(d);
                data.Linear.Add(d2);
                data.Orient.Add(d);
                data.Orient.Add(d3);
                match1.Data.Add(data);

                var data2 = new Data()
                {
                    Accel = new List<DataPoint>(),
                    Linear = new List<DataPoint>(),
                    Orient = new List<DataPoint>(),
                    Match = match1,
                    Player = player2,
                    Hits = 4
                };
                data2.Accel.Add(d);
                data2.Accel.Add(d2);
                data2.Linear.Add(d);
                data2.Linear.Add(d2);
                data2.Orient.Add(d);
                data2.Orient.Add(d3);
                match2.Data.Add(data2);

                match1.Teams.Add(team);
                match1.Teams.Add(team2);
                match1.Players.Add(player);
                match1.Players.Add(player2);
                context.Matches.Add(match1);


                match2.Teams.Add(team);
                match2.Teams.Add(team2);
                match2.Players.Add(player);
                match2.Players.Add(player2);
                context.Matches.Add(match2);
                /*
                var match2 = new Match()
                {
                    Start = DateTime.Now,
                    Players = new List<Player>()
                };*/

                //team.Players.Add(player);
                //match1.Players.Add(player);
                //match1.Teams[0] = team;
                /*
                player.Team = team;
                player.Matches.Add(match1);
                context.Players.Add(player);
                */
                context.SaveChanges();
            }
        }
    }
}
