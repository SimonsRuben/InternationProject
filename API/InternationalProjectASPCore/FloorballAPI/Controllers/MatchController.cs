using FloorballAPI.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FloorballAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly MatchContext context;
        public MatchController(MatchContext myContext)
        {
            context = myContext;
        }

        [Route("{id}")]
        [HttpGet]
        public IActionResult GetPerson(int id)
        {
            var person = context.Players.Find(id);
            if (person == null)
            {
                return NotFound();
            }
            return Ok(person);
        }
    }
}
