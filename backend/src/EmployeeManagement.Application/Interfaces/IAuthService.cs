using EmployeeManagement.Application.DTOs;

namespace EmployeeManagement.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<UserProfileDto?> GetProfileAsync(int userId, CancellationToken cancellationToken = default);
}

public interface IJwtTokenService
{
    string GenerateToken(int userId, string username, string email, string role, out DateTime expiresAt);
}
