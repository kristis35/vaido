namespace backas.DTO
{
    public class CreateUserRequest
    {
        public string PrisijungimoVardas { get; set; }  // Username
        public string Vardas { get; set; }  // First name
        public string Pavarde { get; set; }  // Last name
        public string Telefonas { get; set; }  // Phone number
        public string VartotojoRole { get; set; }  // User role
        public int? universitetasId { get; set; }  // Nullable University ID
        public int? fakultetasId { get; set; }
    }

    public class EditUserRequest
    {
        public string Vardas { get; set; }  // First name
        public string Pavarde { get; set; }  // Last name
        public string Telefonas { get; set; }  // Phone number
        public string VartotojoRole { get; set; }  // User role
        public int? universitetasId { get; set; }  // Optional: University ID
        public int? fakultetasId { get; set; }  // Optional: Faculty ID
    }


}
