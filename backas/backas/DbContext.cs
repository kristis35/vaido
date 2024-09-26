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
        public DbSet<vartotojai> vartotojai { get; set; }
        public DbSet<universitetas> universitetai { get; set; }
        public DbSet<fakultetas> fakultetai { get; set; }
        public DbSet<grupe> grupes { get; set; }  // New grupe table

        // OnModelCreating to configure relationships and keys
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // vartotojai table configuration
            modelBuilder.Entity<vartotojai>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.PrisijungimoVardas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Vardas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Pavarde).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Telefonas).IsRequired().HasMaxLength(20);
                entity.Property(e => e.VartotojoRole).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Slaptazodis).IsRequired().HasMaxLength(255);

                // Relationship with universitetas (Foreign key)
                entity.HasOne(e => e.universitetas)
                      .WithMany(u => u.vartotojai)
                      .HasForeignKey(e => e.universitetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relationship with fakultetas (Foreign key)
                entity.HasOne(e => e.fakultetas)
                      .WithMany(f => f.vartotojai)
                      .HasForeignKey(e => e.fakultetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relationship with grupe (foreign key)
                entity.HasOne(e => e.grupe)
                      .WithMany(g => g.vartotojai)
                      .HasForeignKey(e => e.grupeId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // grupe table configuration
            modelBuilder.Entity<grupe>(entity =>
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
                entity.Property(e => e.grupesSeniunas).HasMaxLength(255);
                entity.Property(e => e.FotografavimoDataVieta).HasMaxLength(500);

                // Relationships
                entity.HasOne(e => e.universitetas)
                      .WithMany(u => u.grupes)
                      .HasForeignKey(e => e.universitetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.fakultetas)
                      .WithMany(f => f.grupes)
                      .HasForeignKey(e => e.fakultetasId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(g => g.vartotojai)
                      .WithOne(v => v.grupe)
                      .HasForeignKey(v => v.grupeId);
            });

            // Configure universitetas table
            modelBuilder.Entity<universitetas>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Pavadinimas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.TrumpasPavadinimas).IsRequired().HasMaxLength(100);
            });

            // fakultetas table configuration
            modelBuilder.Entity<fakultetas>(entity =>
            {
                entity.HasKey(e => e.Id);  // Primary key
                entity.Property(e => e.Pavadinimas).IsRequired().HasMaxLength(255);
                entity.Property(e => e.TrumpasPavadinimas).IsRequired().HasMaxLength(100);

                // Relationship with universitetas
                entity.HasOne(f => f.universitetas)
                      .WithMany(u => u.fakultetai)  // A university can have many faculties
                      .HasForeignKey(f => f.universitetasId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }

    // vartotojai class
    public class vartotojai
    {
        public int Id { get; set; }
        public string PrisijungimoVardas { get; set; }  // Username
        public string Vardas { get; set; }  // First Name
        public string Pavarde { get; set; }  // Last Name
        public string Telefonas { get; set; }  // Phone Number
        public string VartotojoRole { get; set; }  // User Role
        public string Slaptazodis { get; set; }  // Password

        // Nullable foreign key to universitetas (for roles that don't belong to a university)
        public int? universitetasId { get; set; }  // Nullable foreign key for universitetas
        public universitetas universitetas { get; set; }  // Navigation property for universitetas

        // Nullable foreign key to fakultetas (for roles that don't belong to a faculty)
        public int? fakultetasId { get; set; }  // Nullable foreign key for fakultetas
        public fakultetas fakultetas { get; set; }  // Navigation property for fakultetas

        // **New**: Foreign key to grupe
        public int? grupeId { get; set; }  // Nullable foreign key for grupe
        public grupe grupe { get; set; }  // Navigation property for grupe
    }



    // universitetas class
    public class universitetas
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }

        // Navigation property for related fakultetai
        public ICollection<fakultetas> fakultetai { get; set; }

        // Navigation property for related vartotojai
        public ICollection<vartotojai> vartotojai { get; set; }

        // Navigation property for related grupes
        public ICollection<grupe> grupes { get; set; }
    }

    // fakultetas class
    public class fakultetas
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }

        // Foreign key to universitetas
        public int universitetasId { get; set; }
        [JsonIgnore]
        public universitetas universitetas { get; set; } // This breaks the cycle

        // Navigation property for related vartotojai
        public ICollection<vartotojai> vartotojai { get; set; }

        // Navigation property for related grupes
        public ICollection<grupe> grupes { get; set; }
    }

    // grupe class (new table)
    public class grupe
    {
        public int Id { get; set; }
        public string Pavadinimas { get; set; }  // Short name
        public string IlgasPavadinimas { get; set; }  // Long name
        public int universitetasId { get; set; }  // Foreign key to universitetas

        [JsonIgnore]  // Prevents serialization loop
        public universitetas universitetas { get; set; }  // Navigation property for universitetas

        public int fakultetasId { get; set; }  // Foreign key to fakultetas

        [JsonIgnore]  // Prevents serialization loop
        public fakultetas fakultetas { get; set; }  // Navigation property for fakultetas

        public int ĮstojimoMetai { get; set; }  // Enrollment year
        public int BaigimoMetai { get; set; }  // Graduation year
        public int StudentuSkaicius { get; set; }  // Number of students
        public decimal SumoketasAvansas { get; set; }  // Advance payment
        public string ApmokejimoStadija { get; set; }  // Payment status
        public string GamybosStadija { get; set; }  // Production stage
        public bool Pasleptigrupe { get; set; }  // Hide group, order completed
        public string Pastabos { get; set; }  // Notes
        public bool PatvirtintasSarasas { get; set; }  // Approved group list
        public bool BalsavimasMaketai { get; set; }  // Voting on layouts started
        public int grupesSeniunas { get; set; }  // Group senior
        public string FotografavimoDataVieta { get; set; }  // Photography date and location
        [JsonIgnore]
        public ICollection<vartotojai> vartotojai { get; set; }
    }
}
