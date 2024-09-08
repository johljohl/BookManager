using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BookApi.Controllers
{
    [Authorize]  // Requires authentication for all actions in this controller
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        // Static list simulating an in-memory database
        private static List<BookModel> books = new List<BookModel>
        {
            new BookModel { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald" },
            new BookModel { Id = 2, Title = "1984", Author = "George Orwell" },
            new BookModel { Id = 3, Title = "To Kill a Mockingbird", Author = "Harper Lee" }
        };

        // GET: api/Books
        // Retrieves all books
        [HttpGet]
        public ActionResult<IEnumerable<BookModel>> GetBooks()
        {
            return Ok(books); // Returns the full list of books
        }

        // GET: api/Books/{id}
        // Retrieves a specific book by its ID
        [HttpGet("{id}")]
        public ActionResult<BookModel> GetBook(int id)
        {
            var book = books.Find(b => b.Id == id); // Find the book by ID
            if (book == null)
            {
                return NotFound("Book not found"); // Returns 404 if the book doesn't exist
            }

            return Ok(book); // Returns the found book
        }

        // POST: api/Books
        // Adds a new book to the list
        [HttpPost]
        public IActionResult AddBook([FromBody] BookModel book)
        {
            // Checks if Title and Author are provided
            if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            {
                return BadRequest("Title and Author are required");
            }

            // Generates a new ID for the book (incrementing from the last book's ID)
            book.Id = books.Count > 0 ? books[^1].Id + 1 : 1;
            books.Add(book); // Adds the book to the list

            return Ok(); // Returns a successful response
        }

        // PUT: api/Books/{id}
        // Edits an existing book
        [HttpPut("{id}")]
        public IActionResult EditBook(int id, [FromBody] BookModel book)
        {
            var existingBook = books.Find(b => b.Id == id); // Find the book by ID
            if (existingBook == null)
            {
                return NotFound("Book not found"); // Returns 404 if the book doesn't exist
            }

            // Checks if Title and Author are provided
            if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            {
                return BadRequest("Title and Author are required");
            }

            // Update the book's details
            existingBook.Title = book.Title;
            existingBook.Author = book.Author;

            return Ok(); // Returns a successful response
        }

        // DELETE: api/Books/{id}
        // Deletes a book by ID
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = books.Find(b => b.Id == id); // Find the book by ID
            if (book == null)
            {
                return NotFound("Book not found"); // Returns 404 if the book doesn't exist
            }

            books.Remove(book); // Remove the book from the list
            return Ok(); // Returns a successful response
        }
    }

    // Model representing a book
    public class BookModel
    {
        public int Id { get; set; } // Unique identifier for the book
        public string Title { get; set; } // Title of the book
        public string Author { get; set; } // Author of the book
    }
}
