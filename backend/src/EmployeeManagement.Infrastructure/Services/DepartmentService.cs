using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Exceptions;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Services;

public class DepartmentService(AppDbContext context) : IDepartmentService
{
    public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await context.Departments
            .AsNoTracking()
            .Select(d => new DepartmentDto(
                d.Id,
                d.Name,
                d.Description,
                d.Employees.Count,
                d.CreatedAt,
                d.UpdatedAt))
            .OrderBy(d => d.Name)
            .ToListAsync(cancellationToken);

    public async Task<DepartmentDetailDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var department = await context.Departments
            .AsNoTracking()
            .Include(d => d.Employees)
            .ThenInclude(e => e.Department)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken)
            ?? throw new NotFoundException($"Department {id} was not found.");

        var employees = department.Employees
            .OrderBy(e => e.LastName)
            .Select(e => new EmployeeDto(
                e.Id,
                e.Code,
                e.FirstName,
                e.LastName,
                e.Email,
                e.DepartmentId,
                department.Name,
                e.Salary,
                e.HireDate,
                e.Status,
                e.CreatedAt,
                e.UpdatedAt))
            .ToList();

        return new DepartmentDetailDto(
            department.Id,
            department.Name,
            department.Description,
            employees,
            department.CreatedAt,
            department.UpdatedAt);
    }
}
