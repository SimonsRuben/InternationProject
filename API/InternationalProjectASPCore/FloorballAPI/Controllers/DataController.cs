using FloorballAPI.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FloorballAPI.Controllers
{
    [Route("api/v1")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly MatchContext context;
        public DataController(MatchContext myContext)
        {
            context = myContext;
        }
        [Route("Data")]
        [HttpGet]
        public IActionResult GetData(string playerName, int? matchid) //Alle data voor een speler bij 1 match
        {
            if (!string.IsNullOrWhiteSpace(playerName) && !(matchid == null || matchid < 0))
            {
                if (context.Data.Any(d => d.Player.Name == playerName && d.Match.ID == matchid))
                {
                    var data = context.Data.Where(d => d.Match.ID == matchid).Where(d => d.Player.Name == playerName).Select(d => new { d.Match.Start, d.Player.Name, d.Player.ID, d.Player.Icon, d.Accel, d.Linear, d.Orient, d.Hits });
                    return Ok(data);
                }
                return NotFound();
            }
            if (!string.IsNullOrWhiteSpace(playerName))
            {
                if (context.Data.Any(d => d.Player.Name == playerName))
                {
                    var data = context.Data.Where(d => d.Player.Name == playerName).Include(d => d.Accel).Include(d => d.Linear).Include(d => d.Orient).Include(d => d.Match);// d.Match.Select(m => new { m.Start, m.ID });
                    return Ok(data);
                }
            }
            else
            {
                return StatusCode(403);
                //return Ok(context.Data.Include(d => d.Player)); Giving back all data can create a massive data dump
            }
            return NotFound();
        }

        [Route("Data")]
        [HttpPost]
        public IActionResult CreateDataPoint([FromBody] Data data)
        {
            Match activeMatch = context.Matches.Where(m => m.Active == true).FirstOrDefault();
            Player activePlayer = context.Players.Where(m => m.Active == true).FirstOrDefault();
            if (context.Data.Any(d => d.Match == activeMatch && d.Player == activePlayer))
            {
                int id = context.Data.Where(d => d.Match == activeMatch && d.Player == activePlayer).FirstOrDefault().ID;
                Data data1 = context.Data.Include(d => d.Accel).Include(d => d.Linear).Include(d => d.Orient).SingleOrDefault(d => d.ID == id);
                data1.Hits += data.Hits;
                foreach (var dataPoint in data.Accel)
                {
                    data1.Accel.Add(dataPoint);
                }
                foreach (var dataPoint in data.Linear)
                {
                    data1.Linear.Add(dataPoint);
                }
                foreach (var dataPoint in data.Orient)
                {
                    data1.Orient.Add(dataPoint);
                }
                context.SaveChanges();
                return Ok(data1);
            }
            else
            {
                data.Player = activePlayer;
                data.Match = activeMatch;
                context.Data.Add(data);
                context.SaveChanges();
            }
            return Created($"Data added", data);
        }
        /* Makes new datapoints, works, not used yet
        [Route("Datapoints")]
        [HttpPost]
        public IActionResult CreateDataPoint([FromBody] DataPoint dataPoint)
        {
            context.DataPoints.Add(dataPoint);
            context.SaveChanges();
            return Created($"It works!", dataPoint);
        
        }*/
    }
}
