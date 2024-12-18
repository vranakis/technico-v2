using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.Context;
using Technico.DTOs;
using Technico.Interfaces;
using Technico.Models;

namespace Technico.Repositories;

public class UserRepository : IRepository<User, Guid>, IUserRepo
{
    private readonly TechnicoDbContext _context;
    public UserRepository(TechnicoDbContext context)
    {
        _context = context;
    }

    public async Task<User?> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<List<User>?> GetAllAsync(int pageCount, int pageSize)
    {
        return await _context.Users.Skip((pageCount - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<User?> GetAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);       
    }

    public async Task<User?> UpdateAsync(Guid id, User user)
    {
        // Step 1: Validate the input
        if (user == null) 
        {
            throw new ArgumentNullException(nameof(UserResponseDto), "Input user data cannot be null.");
        }

        // Step 2: Retrieve the existing user from the repository
        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
        {
            return null;
        }

        // Step 3: Update the user's properties
        existingUser.Name = user.Name;
        existingUser.Surname = user.Surname;

        // Step 4: Save the changes to the database
        await _context.SaveChangesAsync();

        return existingUser;
    }

    public async Task<User?> DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) 
        {
            return null;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return user;
    }

    private bool UserExists(Guid id)
    {
        return _context.Users.Any(u => u.Id == id);
    }


    public Task<User?> AuthenticateUser(string email, string password)
    {
        return _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
    }

    public async Task<int> CountAsync()
    {
         return await _context.Users.CountAsync();
    }

    public async Task<List<User>> SearchUsersAsync(string searchQuery)
    {
        return await _context.Users
            .Where(user => user.Name!.Contains(searchQuery) || user.Surname!.Contains(searchQuery))
            .ToListAsync();
    }
    public Task<List<User>?> GetAllByGuidAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task DeleteRangeAsync(List<User> user)
    {
        throw new NotImplementedException();
    }
}