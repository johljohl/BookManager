using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BookApi.Controllers
{
    [Authorize]  // Requires authentication for all actions in this controller
    [Route("api/[controller]")]
    [ApiController]
    public class QuotesController : ControllerBase
    {
        // Static list simulating a simple in-memory store for quotes
        private static List<string> quotes = new List<string>
        {
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Life is what happens when you're busy making other plans. - John Lennon",
            "Get busy living or get busy dying. - Stephen King",
            "You only live once, but if you do it right, once is enough. - Mae West",
            "In the end, we only regret the chances we didn't take. - Lewis Carroll"
        };

        // GET: api/quotes - Retrieves the list of quotes
        [HttpGet]
        public ActionResult<IEnumerable<string>> GetQuotes()
        {
            return Ok(quotes);  // Returns the list of quotes
        }

        // POST: api/quotes - Adds a new quote to the list
        [HttpPost]
        public IActionResult AddQuote([FromBody] QuoteModel quoteModel)
        {
            // Ensure the quote is not empty
            if (string.IsNullOrWhiteSpace(quoteModel.Quote))
            {
                return BadRequest("Quote cannot be empty");
            }

            quotes.Add(quoteModel.Quote);  // Add the new quote
            return Ok();
        }

        // PUT: api/quotes/{index} - Edits an existing quote at the given index
        [HttpPut("{index}")]
        public IActionResult EditQuote(int index, [FromBody] QuoteModel quoteModel)
        {
            // Validate that the index is within the range of the list
            if (index < 0 || index >= quotes.Count)
            {
                return NotFound("Quote not found");
            }

            // Ensure the new quote is not empty
            if (string.IsNullOrWhiteSpace(quoteModel.Quote))
            {
                return BadRequest("Quote cannot be empty");
            }

            quotes[index] = quoteModel.Quote;  // Update the quote at the given index
            return Ok();
        }

        // DELETE: api/quotes/{index} - Deletes a quote by its index
        [HttpDelete("{index}")]
        public IActionResult DeleteQuote(int index)
        {
            // Check if the index is valid
            if (index < 0 || index >= quotes.Count)
            {
                return NotFound("Quote not found");
            }

            quotes.RemoveAt(index);  // Remove the quote at the specified index
            return Ok();
        }
    }

    // Model representing a quote
    public class QuoteModel
    {
        public string Quote { get; set; }  // Holds the quote text
    }
}
