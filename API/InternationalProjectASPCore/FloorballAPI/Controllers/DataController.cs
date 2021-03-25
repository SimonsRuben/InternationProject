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
            if (!string.IsNullOrWhiteSpace(playerName) || !(matchid == null || matchid < 0))
            {
                if (context.Data.Any(d => d.Player.Name == playerName && d.Match.ID == matchid))
                {
                    var data = context.Data.Where(d => d.Match.ID == matchid).Where(d => d.Player.Name == playerName).Select(d => new { d.Match.Start, d.Player.Name, d.Player.ID, d.Player.Icon, d.Accel, d.Linear, d.Orient, d.Hits });
                    return Ok(data);
                }
                return NotFound();
            }
            return NotFound();
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
