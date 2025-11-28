namespace DevoBackend.Models
{
    public class HelpArticle
    {
        public int HelpArticleId { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int CreatedBy { get; set; }

        public User Creator { get; set; } = null!;
    }

}
