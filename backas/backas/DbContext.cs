using Microsoft.EntityFrameworkCore;

namespace backas
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets representing the tables in the database
        public DbSet<Vartotojai> Vartotojai { get; set; }
        public DbSet<Fotografas> Fotografai { get; set; }
        public DbSet<Maketuotojas> Maketuotojai { get; set; }
        public DbSet<Universitetas> Universitetai { get; set; }
        public DbSet<Fakultetas> Fakultetai { get; set; }

        // OnModelCreating to configure relationships and keys
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Vartotojai table configuration
            modelBuilder.Entity<Vartotojai>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.PrisijungimoVardas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Vardas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Pavarde).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Telefonas).IsRequired().HasMaxLength(20);
                entity.Property(e => e.VartotojoRole).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Slaptazodis).IsRequired().HasMaxLength(255);

                // Relationships
                entity.HasOne(e => e.Fotografas)
                      .WithMany()
                      .HasForeignKey(e => e.FotografasId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Maketuotojas)
                      .WithMany()
                      .HasForeignKey(e => e.MaketuotojasId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relationship with Universitetas (Foreign key)
                entity.HasOne(e => e.Universitetas)
                      .WithMany(u => u.Vartotojai)
                      .HasForeignKey(e => e.UniversitetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relationship with Fakultetas (Foreign key)
                entity.HasOne(e => e.Fakultetas)
                      .WithMany(f => f.Vartotojai)
                      .HasForeignKey(e => e.FakultetasId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Fotografas table configuration
            modelBuilder.Entity<Fotografas>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PortfolioUrl).HasMaxLength(500);
            });

            // Maketuotojas table configuration
            modelBuilder.Entity<Maketuotojas>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.DesignUrl).HasMaxLength(500);
            });

            // Configure Universitetas table
            modelBuilder.Entity<Universitetas>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Pavadinimas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.TrumpasPavadinimas).IsRequired().HasMaxLength(100);
            });

            // Fakultetas table configuration
            modelBuilder.Entity<Fakultetas>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Pavadinimas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.TrumpasPavadinimas).IsRequired().HasMaxLength(100);

                // Relationship with Universitetas
                entity.HasOne(f => f.Universitetas)
                      .WithMany(u => u.Fakultetai)  // A university can have many faculties
                      .HasForeignKey(f => f.UniversitetasId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }

    }

    // Vartotojai class
    public class Vartotojai
    {
        public int Id { get; set; }
        public string PrisijungimoVardas { get; set; }  // Username
        public string Vardas { get; set; }  // First Name
        public string Pavarde { get; set; }  // Last Name
        public string Telefonas { get; set; }  // Phone Number
        public string VartotojoRole { get; set; }  // User Role
        public string Slaptazodis { get; set; }  // Password

        // Foreign key to Universitetas
        public int UniversitetasId { get; set; }  // Foreign key for Universitetas
        public Universitetas Universitetas { get; set; }  // Navigation property for Universitetas

        // Foreign key to Fakultetas
        public int FakultetasId { get; set; }  // Foreign key for Fakultetas
        public Fakultetas Fakultetas { get; set; }  // Navigation property for Fakultetas

        // Optional Foreign keys for Fotografas and Maketuotojas
        public int? FotografasId { get; set; }
        public Fotografas Fotografas { get; set; }

        public int? MaketuotojasId { get; set; }
        public Maketuotojas Maketuotojas { get; set; }
    }




    // Fotografas class
    public class Fotografas
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PortfolioUrl { get; set; }
    }

    // Maketuotojas class
    public class Maketuotojas
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DesignUrl { get; set; }
    }

    public class Universitetas
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }

        // Navigation property for related Fakultetai
        public ICollection<Fakultetas> Fakultetai { get; set; }

        // Navigation property for related Vartotojai
        public ICollection<Vartotojai> Vartotojai { get; set; }
    }

    public class Fakultetas
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }

        // Foreign key to Universitetas
        public int UniversitetasId { get; set; }
        public Universitetas Universitetas { get; set; }

        // Navigation property for related Vartotojai
        public ICollection<Vartotojai> Vartotojai { get; set; }
    }


}
