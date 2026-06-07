namespace EmployeeManagement.Application.DTOs;

public record LoginRequest(string Username, string Password);

public record LoginResponse(string Token, DateTime ExpiresAt, UserProfileDto User);

public record UserProfileDto(int Id, string Username, string Email, string Role);
