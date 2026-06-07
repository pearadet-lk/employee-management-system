namespace EmployeeManagement.Application.DTOs;

public record DepartmentDto(
    int Id,
    string Name,
    string? Description,
    int EmployeeCount,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record DepartmentDetailDto(
    int Id,
    string Name,
    string? Description,
    IReadOnlyList<EmployeeDto> Employees,
    DateTime CreatedAt,
    DateTime UpdatedAt);
