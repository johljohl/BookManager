using Microsoft.EntityFrameworkCore;
using BookApi.Models;

namespace BookApi.Data
{
    // DbContext class for managing database access
    public class BookContext : DbContext
    {
        // Constructor that accepts options for configuring the context (e.g., connection strings)
        public BookContext(DbContextOptions<BookContext> options) : base(options) { }

        // DbSet representing the Books table in the database
        public DbSet<Book> Books { get; set; }
    }
}
