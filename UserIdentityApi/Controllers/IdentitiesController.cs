using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserIdentityApi.Data;
using UserIdentityApi.Models;

namespace UserIdentityApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdentitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IdentitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserIdentity>> GetUserIdentity(int id)
        {
            var userIdentity = await _context.UserIdentities.FindAsync(id);

            if (userIdentity == null)
            {
                return NotFound();
            }

            return userIdentity;
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUserIdentity(int id, [FromBody] UserIdentityUpdateDto updateDto)
        {
            var userIdentity = await _context.UserIdentities.FindAsync(id);

            if (userIdentity == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(updateDto.Email))
            {
                userIdentity.Email = updateDto.Email;
            }

            if (!string.IsNullOrEmpty(updateDto.FullName))
            {
                userIdentity.FullName = updateDto.FullName;
            }

            if (!string.IsNullOrEmpty(updateDto.SourceSystem))
            {
                userIdentity.SourceSystem = updateDto.SourceSystem;
            }

            userIdentity.IsActive = updateDto.IsActive;
            userIdentity.LastUpdated = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserIdentityExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        private bool UserIdentityExists(int id)
        {
            return _context.UserIdentities.Any(e => e.Id == id);
        }
    }

    public class UserIdentityUpdateDto
    {
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? SourceSystem { get; set; }
        public bool IsActive { get; set; }
    }
} 