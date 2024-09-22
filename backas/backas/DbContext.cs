using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json.Serialization;

namespace backas
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets representing the tables in the database
        public DbSet<Vartotojai> Vartotojai { get; set; }
        public DbSet<Universitetas> Universitetai { get; set; }
        public DbSet<Fakultetas> Fakultetai { get; set; }
        public DbSet<Grupe> Grupes { get; set; }  // New Grupe table

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

                // Relationship with Grupe (foreign key)
                entity.HasOne(e => e.Grupe)
                      .WithMany(g => g.Vartotojai)
                      .HasForeignKey(e => e.GrupeId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Grupe table configuration
            modelBuilder.Entity<Grupe>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Pavadinimas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.IlgasPavadinimas).HasMaxLength(500);
                entity.Property(e => e.ĮstojimoMetai).IsRequired();
                entity.Property(e => e.BaigimoMetai).IsRequired();
                entity.Property(e => e.StudentuSkaicius).IsRequired();
                entity.Property(e => e.SumoketasAvansas).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ApmokejimoStadija).IsRequired().HasMaxLength(255);
                entity.Property(e => e.GamybosStadija).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Pastabos).HasMaxLength(1000);
                entity.Property(e => e.GrupesSeniunas).HasMaxLength(255);
                entity.Property(e => e.FotografavimoDataVieta).HasMaxLength(500);

                // Relationships
                entity.HasOne(e => e.Universitetas)
                      .WithMany(u => u.Grupes)
                      .HasForeignKey(e => e.UniversitetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Fakultetas)
                      .WithMany(f => f.Grupes)
                      .HasForeignKey(e => e.FakultetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(g => g.Vartotojai)
                      .WithOne(v => v.Grupe)
                      .HasForeignKey(v => v.GrupeId);
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

        // Nullable foreign key to Universitetas (for roles that don't belong to a university)
        public int? UniversitetasId { get; set; }  // Nullable foreign key for Universitetas
        public Universitetas Universitetas { get; set; }  // Navigation property for Universitetas

        // Nullable foreign key to Fakultetas (for roles that don't belong to a faculty)
        public int? FakultetasId { get; set; }  // Nullable foreign key for Fakultetas
        public Fakultetas Fakultetas { get; set; }  // Navigation property for Fakultetas

        // **New**: Foreign key to Grupe
        public int? GrupeId { get; set; }  // Nullable foreign key for Grupe
        public Grupe Grupe { get; set; }  // Navigation property for Grupe
    }



    // Universitetas class
    public class Universitetas
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }

        // Navigation property for related Fakultetai
        public ICollection<Fakultetas> Fakultetai { get; set; }

        // Navigation property for related Vartotojai
        public ICollection<Vartotojai> Vartotojai { get; set; }

        // Navigation property for related Grupes
        public ICollection<Grupe> Grupes { get; set; }
    }

    // Fakultetas class
    public class Fakultetas
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }

        // Foreign key to Universitetas
        public int UniversitetasId { get; set; }
        [JsonIgnore]
        public Universitetas Universitetas { get; set; } // This breaks the cycle

        // Navigation property for related Vartotojai
        public ICollection<Vartotojai> Vartotojai { get; set; }

        // Navigation property for related Grupes
        public ICollection<Grupe> Grupes { get; set; }
    }

    // Grupe class (new table)
    public class Grupe
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }  // Short name
        public string IlgasPavadinimas { get; set; }  // Long name
        public int UniversitetasId { get; set; }  // Foreign key to Universitetas
        public Universitetas Universitetas { get; set; }  // Navigation property for Universitetas
        public int FakultetasId { get; set; }  // Foreign key to Fakultetas
        public Fakultetas Fakultetas { get; set; }  // Navigation property for Fakultetas
        public int ĮstojimoMetai { get; set; }  // Enrollment year
        public int BaigimoMetai { get; set; }  // Graduation year
        public int StudentuSkaicius { get; set; }  // Number of students
        public decimal SumoketasAvansas { get; set; }  // Advance payment
        public string ApmokejimoStadija { get; set; }  // Payment status
        public string GamybosStadija { get; set; }  // Production stage
        public bool PasleptiGrupe { get; set; }  // Hide group, order completed
        public string Pastabos { get; set; }  // Notes
        public bool PatvirtintasSarasas { get; set; }  // Approved group list
        public bool BalsavimasMaketai { get; set; }  // Voting on layouts started
        public string GrupesSeniunas { get; set; }  // Group senior
        public string FotografavimoDataVieta { get; set; }  // Photography date and location

        // **New**: Navigation property for related Vartotojai
        public ICollection<Vartotojai> Vartotojai { get; set; }
    }

}
