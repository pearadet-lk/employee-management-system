using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Services;

public class AuthService(AppDbContext context, IJwtTokenService jwtTokenService) : IAuthService
{
    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var token = jwtTokenService.GenerateToken(
            user.Id,
            user.Username,
            user.Email,
            user.Role.ToString(),
            out var expiresAt);

        return new LoginResponse(token, expiresAt, MapProfile(user));
    }

    public async Task<UserProfileDto?> GetProfileAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        return user is null ? null : MapProfile(user);
    }

    private static UserProfileDto MapProfile(Domain.Entities.ApplicationUser user) =>
        new(user.Id, user.Username, user.Email, user.Role.ToString());
}
