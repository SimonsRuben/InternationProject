﻿using FloorballAPI.Model;
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
                     return Ok(people.Where(t => t.Name == playerName).Select(p => new { p.Name, p.Icon, p.Team, p.ID, Matches = p.Matches.Select(m => new { m.Start, m.ID })}));
                else
                    return NotFound();
            }
            if (people == null)
                return NotFound();
            return Ok(people.OrderBy(t => t.Name));
        }
        [Route("Matches")]
        [HttpGet]
        public IActionResult GetMatches() //Laat alle matches zien en de teams die in deze matches gespeeld hebben
        {
            var matches = context.Matches.Select(m => new { m.ID, m.Start, Teams = m.Teams.Select(t => t.Name) });
            if (matches == null)
            {
                return NotFound();
            }
            return Ok(matches.OrderBy(m => m.Start));
        }
        /*
        // WIP
        [Route("Matches")]
        [HttpPost]
        public IActionResult CreateMatch([FromBody] Match match)
        {
            context.Matches.Add(match);
            context.SaveChanges();
            return Created($"http://localhost:61379/api/v1/Matches/{match.ID}", match);
        }*/

        [Route("Matches/{id}")]
        [HttpGet]
        public IActionResult GetMatch(int id) //Laat alle info over een specifieke match zien
        {
            if (context.Matches.Any(m => m.ID == id))
            {
                var matches = context.Matches.Where(m => m.ID == id).Select(m => new { m.ID, m.Start, Teams = m.Teams.Select(t => t.Name), Players = m.Players.Select(p => new { p.Name, TeamName=p.Team.Name })});
                return Ok(matches);
            }
            return NotFound();
        }
    }
}
