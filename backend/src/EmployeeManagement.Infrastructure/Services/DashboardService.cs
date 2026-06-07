using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Enums;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Services;

public class DashboardService(AppDbContext context) : IDashboardService
{
    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalEmployees = await context.Employees.CountAsync(cancellationToken);
        var totalDepartments = await context.Departments.CountAsync(cancellationToken);
        var newEmployeesThisMonth = await context.Employees
            .CountAsync(e => e.CreatedAt >= monthStart, cancellationToken);

        var averageSalary = totalEmployees == 0
            ? 0
            : await context.Employees.AverageAsync(e => e.Salary, cancellationToken);

        return new DashboardStatsDto(
            totalEmployees,
            totalDepartments,
            newEmployeesThisMonth,
            Math.Round(averageSalary, 2));
    }
}

public class ReportService(AppDbContext context) : IReportService
{
    public async Task<IReadOnlyList<DepartmentReportItemDto>> GetEmployeesByDepartmentAsync(
        CancellationToken cancellationToken = default) =>
        await context.Departments
            .AsNoTracking()
            .Select(d => new DepartmentReportItemDto(d.Name, d.Employees.Count(e => e.Status != EmployeeStatus.Terminated)))
            .OrderByDescending(x => x.EmployeeCount)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<SalaryRangeReportItemDto>> GetEmployeesBySalaryRangeAsync(
        CancellationToken cancellationToken = default)
    {
        var employees = await context.Employees.AsNoTracking().Select(e => e.Salary).ToListAsync(cancellationToken);

        var ranges = new (string Label, Func<decimal, bool> Predicate)[]
        {
            ("< 50k", s => s < 50000),
            ("50k - 75k", s => s >= 50000 && s < 75000),
            ("75k - 100k", s => s >= 75000 && s < 100000),
            (">= 100k", s => s >= 100000)
        };

        return ranges
            .Select(r => new SalaryRangeReportItemDto(r.Label, employees.Count(r.Predicate)))
            .ToList();
    }

    public async Task<IReadOnlyList<HiringTrendItemDto>> GetHiringTrendAsync(
        int months = 12,
        CancellationToken cancellationToken = default)
    {
        months = Math.Clamp(months, 1, 36);
        var start = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-months + 1));

        var hires = await context.Employees
            .AsNoTracking()
            .Where(e => e.HireDate >= start)
            .GroupBy(e => new { e.HireDate.Year, e.HireDate.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var result = new List<HiringTrendItemDto>();
        var cursor = new DateOnly(start.Year, start.Month, 1);

        for (var i = 0; i < months; i++)
        {
            var match = hires.FirstOrDefault(h => h.Year == cursor.Year && h.Month == cursor.Month);
            result.Add(new HiringTrendItemDto(cursor.ToString("yyyy-MM"), match?.Count ?? 0));
            cursor = cursor.AddMonths(1);
        }

        return result;
    }
}
