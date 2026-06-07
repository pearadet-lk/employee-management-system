namespace EmployeeManagement.Application.DTOs;

public record DashboardStatsDto(
    int TotalEmployees,
    int TotalDepartments,
    int NewEmployeesThisMonth,
    decimal AverageSalary);
