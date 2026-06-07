using EmployeeManagement.Application.DTOs;

namespace EmployeeManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default);
}

public interface IReportService
{
    Task<IReadOnlyList<DepartmentReportItemDto>> GetEmployeesByDepartmentAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SalaryRangeReportItemDto>> GetEmployeesBySalaryRangeAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<HiringTrendItemDto>> GetHiringTrendAsync(int months = 12, CancellationToken cancellationToken = default);
}
