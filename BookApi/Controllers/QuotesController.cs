using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BookApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuotesController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<string>> GetQuotes()
        {
            var quotes = new List<string>
            {
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Life is what happens when you're busy making other plans. - John Lennon",
                "Get busy living or get busy dying. - Stephen King",
                "You only live once, but if you do it right, once is enough. - Mae West",
                "In the end, we only regret the chances we didn't take. - Lewis Carroll"
            };

            return Ok(quotes);
        }
    }
}
