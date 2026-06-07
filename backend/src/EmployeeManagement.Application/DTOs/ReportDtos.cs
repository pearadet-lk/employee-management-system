namespace EmployeeManagement.Application.DTOs;

public record DepartmentReportItemDto(string DepartmentName, int EmployeeCount);

public record SalaryRangeReportItemDto(string RangeLabel, int EmployeeCount);

public record HiringTrendItemDto(string Month, int HireCount);
