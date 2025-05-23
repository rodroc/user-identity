using Microsoft.EntityFrameworkCore;
using UserIdentityApi.Models;

namespace UserIdentityApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserIdentity> UserIdentities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed some initial data
            modelBuilder.Entity<UserIdentity>().HasData(
                new UserIdentity
                {
                    Id = 1,
                    UserId = "user1",
                    FullName = "Rod Roc",
                    Email = "rod@roc.com",
                    SourceSystem = "Staging",
                    LastUpdated = DateTime.UtcNow,
                    IsActive = true
                }
            );
        }
    }
} 