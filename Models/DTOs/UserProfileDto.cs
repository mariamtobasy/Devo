namespace DevoBackend.Models.DTOs
{
    public class UserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string DepartmentId { get; set; } = string.Empty;
        public string ReportsTo { get; set; } = string.Empty;
        public string Email{ get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string ProfilePhoto { get; set; } = "/pfp.jpg";
    }
}
