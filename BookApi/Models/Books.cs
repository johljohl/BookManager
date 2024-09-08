namespace BookApi.Models
{
    // Model representing a book entity
    public class Book
    {
        // Primary key (unique identifier for the book)
        public int Id { get; set; }

        // Title of the book, defaulting to an empty string
        public string Title { get; set; } = string.Empty;

        // Author of the book, defaulting to an empty string
        public string Author { get; set; } = string.Empty;

        // Publication date of the book
        public DateTime PublicationDate { get; set; }
    }
}
