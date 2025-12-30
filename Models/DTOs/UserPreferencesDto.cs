namespace DevoBackend.Models.DTOs
{
    public class UserPreferencesDto
    {
        public int UserId { get; set; }
        public bool CookiesAccepted { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string Language { get; set; } = "English";
        public string TimeZone { get; set; } = "UTC";

     //   public string Theme { get; set; } = "Light";
    }


}