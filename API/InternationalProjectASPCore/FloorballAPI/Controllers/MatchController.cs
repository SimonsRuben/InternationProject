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
    public class MatchController : ControllerBase
    {
        private readonly MatchContext context;
        public MatchController(MatchContext myContext)
        {
            context = myContext;
        }

        [Route("Teams")]
        [HttpGet]
        public IActionResult GetTeams(string teamName)
        {
            var teams = context.Teams.Select(t => new { t.Name, t.Players });
            if (!string.IsNullOrWhiteSpace(teamName)) {
                if (teams.Any(t => t.Name == teamName))
                    teams = teams.Where(t => t.Name == teamName);
                else
                    teams = null;
            }
            if (teams == null)
                return NotFound();
            return Ok(teams.OrderBy(t => t.Name));
        }
        [Route("Players")]
        [HttpGet]
        public IActionResult GetPlayers(string playerName) //Laat alle players zien: naam, icon en alle matches waar ze in gespeeld hebben, je kan zoeken op playernaam
        {
            IQueryable<Player> people = context.Players;
            if (!string.IsNullOrWhiteSpace(playerName))
            {
                if (people.Any(t => t.Name == playerName))
                     return Ok(people.Where(t => t.Name == playerName).Select(p => new { p.Name, p.Icon, p.Team, p.ID, Matches = p.Matches.Select(m => m.Start) }));
                else
                    people = null;
            }
            if (people == null)
                return NotFound();
            return Ok(people.OrderBy(t => t.Name));
        }
        [Route("Matches")]
        [HttpGet]
        public IActionResult GetMatches() //Laat alle matches zien en de teams die in deze matches gespeeld hebben
        {
            var matches = context.Matches.Select(m => new { m.Start, Teams = m.Teams.Select(t => t.Name) });
            if (matches == null)
            {
                return NotFound();
            }
            return Ok(matches.OrderBy(m => m.Start));
        }


    }
}
