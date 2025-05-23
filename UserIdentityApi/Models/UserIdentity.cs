using System;
using System.ComponentModel.DataAnnotations;

namespace UserIdentityApi.Models
{
    public class UserIdentity
    {
        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string SourceSystem { get; set; }

        public DateTime LastUpdated { get; set; }

        public bool IsActive { get; set; }
    }
} 