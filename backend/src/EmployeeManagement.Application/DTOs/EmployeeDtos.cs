using EmployeeManagement.Domain.Enums;

namespace EmployeeManagement.Application.DTOs;

public record EmployeeDto(
    int Id,
    string Code,
    string FirstName,
    string LastName,
    string Email,
    int DepartmentId,
    string DepartmentName,
    decimal Salary,
    DateOnly HireDate,
    EmployeeStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record CreateEmployeeRequest(
    string Code,
    string FirstName,
    string LastName,
    string Email,
    int DepartmentId,
    decimal Salary,
    DateOnly HireDate,
    EmployeeStatus Status);

public record UpdateEmployeeRequest(
    string Code,
    string FirstName,
    string LastName,
    string Email,
    int DepartmentId,
    decimal Salary,
    DateOnly HireDate,
    EmployeeStatus Status);

public record EmployeeQuery(
    string? Search = null,
    int? DepartmentId = null,
    EmployeeStatus? Status = null,
    string? SortBy = "lastName",
    string? SortDirection = "asc",
    int Page = 1,
    int PageSize = 20);
