namespace backas.DTO
{
    public class CreateUserRequest
    {
        public string PrisijungimoVardas { get; set; }  // Username
        public string Vardas { get; set; }  // First name
        public string Pavarde { get; set; }  // Last name
        public string Telefonas { get; set; }  // Phone number
        public string VartotojoRole { get; set; }  // User role
        public int UniversitetasId { get; set; }  // University ID
        public int FakultetasId { get; set; }  // Faculty ID
    }

}
