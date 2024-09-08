using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BookApi.Controllers
{
    [Authorize]  // Autentisering krävs för alla actions
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        // Statisk lista som simulerar en databas i minnet
        private static List<BookModel> books = new List<BookModel>
        {
            new BookModel { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald" },
            new BookModel { Id = 2, Title = "1984", Author = "George Orwell" },
            new BookModel { Id = 3, Title = "To Kill a Mockingbird", Author = "Harper Lee" }
        };

        // GET: api/Books
        [HttpGet]
        public ActionResult<IEnumerable<BookModel>> GetBooks()
        {
            return Ok(books);
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public ActionResult<BookModel> GetBook(int id)
        {
            var book = books.Find(b => b.Id == id);
            if (book == null)
            {
                return NotFound("Book not found");
            }

            return Ok(book);
        }

        // POST: api/Books
        [HttpPost]
        public IActionResult AddBook([FromBody] BookModel book)
        {
            if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            {
                return BadRequest("Title and Author are required");
            }

            book.Id = books.Count > 0 ? books[^1].Id + 1 : 1; // Genererar ett nytt ID
            books.Add(book);

            return Ok();
        }

        // PUT: api/Books/5
        [HttpPut("{id}")]
        public IActionResult EditBook(int id, [FromBody] BookModel book)
        {
            var existingBook = books.Find(b => b.Id == id);
            if (existingBook == null)
            {
                return NotFound("Book not found");
            }

            if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            {
                return BadRequest("Title and Author are required");
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;

            return Ok();
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = books.Find(b => b.Id == id);
            if (book == null)
            {
                return NotFound("Book not found");
            }

            books.Remove(book);
            return Ok();
        }
    }

    // Modell för en bok
    public class BookModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
    }
}
