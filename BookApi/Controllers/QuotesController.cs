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
        private static List<string> quotes = new List<string>
        {
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Life is what happens when you're busy making other plans. - John Lennon",
            "Get busy living or get busy dying. - Stephen King",
            "You only live once, but if you do it right, once is enough. - Mae West",
            "In the end, we only regret the chances we didn't take. - Lewis Carroll"
        };

        [HttpGet]
        public ActionResult<IEnumerable<string>> GetQuotes()
        {
            return Ok(quotes);
        }

        [HttpPost]
        public IActionResult AddQuote([FromBody] QuoteModel quoteModel)
        {
            if (string.IsNullOrWhiteSpace(quoteModel.Quote))
            {
                return BadRequest("Quote cannot be empty");
            }

            quotes.Add(quoteModel.Quote);
            return Ok();
        }

        [HttpPut("{index}")]
        public IActionResult EditQuote(int index, [FromBody] QuoteModel quoteModel)
        {
            if (index < 0 || index >= quotes.Count)
            {
                return NotFound("Quote not found");
            }

            if (string.IsNullOrWhiteSpace(quoteModel.Quote))
            {
                return BadRequest("Quote cannot be empty");
            }

            quotes[index] = quoteModel.Quote;
            return Ok();
        }

        [HttpDelete("{index}")]
        public IActionResult DeleteQuote(int index)
        {
            if (index < 0 || index >= quotes.Count)
            {
                return NotFound("Quote not found");
            }

            quotes.RemoveAt(index);
            return Ok();
        }
    }

    public class QuoteModel
    {
        public string Quote { get; set; }
    }
}
