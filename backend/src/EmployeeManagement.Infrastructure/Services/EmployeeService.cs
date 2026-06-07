using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Exceptions;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Services;

public class EmployeeService(AppDbContext context) : IEmployeeService
{
    public async Task<PagedResult<EmployeeDto>> GetEmployeesAsync(EmployeeQuery query, CancellationToken cancellationToken = default)
    {
        var employees = context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            employees = employees.Where(e =>
                e.FirstName.ToLower().Contains(search) ||
                e.LastName.ToLower().Contains(search) ||
                e.Email.ToLower().Contains(search) ||
                e.Code.ToLower().Contains(search));
        }

        if (query.DepartmentId.HasValue)
        {
            employees = employees.Where(e => e.DepartmentId == query.DepartmentId.Value);
        }

        if (query.Status.HasValue)
        {
            employees = employees.Where(e => e.Status == query.Status.Value);
        }

        employees = ApplySorting(employees, query.SortBy, query.SortDirection);

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var totalCount = await employees.CountAsync(cancellationToken);

        var items = await employees
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(EmployeeMapper.ProjectToDto)
            .ToListAsync(cancellationToken);

        return new PagedResult<EmployeeDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<EmployeeDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var employee = await context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Where(e => e.Id == id)
            .Select(EmployeeMapper.ProjectToDto)
            .FirstOrDefaultAsync(cancellationToken);

        return employee ?? throw new NotFoundException($"Employee {id} was not found.");
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureDepartmentExistsAsync(request.DepartmentId, cancellationToken);
        await EnsureUniqueAsync(request.Code, request.Email, null, cancellationToken);

        var employee = new Employee
        {
            Code = request.Code.Trim(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            DepartmentId = request.DepartmentId,
            Salary = request.Salary,
            HireDate = request.HireDate,
            Status = request.Status
        };

        context.Employees.Add(employee);
        await context.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(employee.Id, cancellationToken);
    }

    public async Task<EmployeeDto> UpdateAsync(int id, UpdateEmployeeRequest request, CancellationToken cancellationToken = default)
    {
        var employee = await context.Employees.FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            ?? throw new NotFoundException($"Employee {id} was not found.");

        await EnsureDepartmentExistsAsync(request.DepartmentId, cancellationToken);
        await EnsureUniqueAsync(request.Code, request.Email, id, cancellationToken);

        employee.Code = request.Code.Trim();
        employee.FirstName = request.FirstName.Trim();
        employee.LastName = request.LastName.Trim();
        employee.Email = request.Email.Trim().ToLowerInvariant();
        employee.DepartmentId = request.DepartmentId;
        employee.Salary = request.Salary;
        employee.HireDate = request.HireDate;
        employee.Status = request.Status;

        await context.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var employee = await context.Employees.FirstOrDefaultAsync(e => e.Id == id, cancellationToken)
            ?? throw new NotFoundException($"Employee {id} was not found.");

        context.Employees.Remove(employee);
        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureDepartmentExistsAsync(int departmentId, CancellationToken cancellationToken)
    {
        if (!await context.Departments.AnyAsync(d => d.Id == departmentId, cancellationToken))
        {
            throw new NotFoundException($"Department {departmentId} was not found.");
        }
    }

    private async Task EnsureUniqueAsync(string code, string email, int? excludeId, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var normalizedCode = code.Trim();

        if (await context.Employees.AnyAsync(e =>
                e.Code == normalizedCode && (!excludeId.HasValue || e.Id != excludeId.Value), cancellationToken))
        {
            throw new InvalidOperationException($"Employee code '{normalizedCode}' already exists.");
        }

        if (await context.Employees.AnyAsync(e =>
                e.Email == normalizedEmail && (!excludeId.HasValue || e.Id != excludeId.Value), cancellationToken))
        {
            throw new InvalidOperationException($"Email '{normalizedEmail}' is already in use.");
        }
    }

    private static IQueryable<Employee> ApplySorting(IQueryable<Employee> query, string? sortBy, string? sortDirection)
    {
        var descending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);
        return (sortBy?.ToLowerInvariant()) switch
        {
            "firstname" => descending ? query.OrderByDescending(e => e.FirstName) : query.OrderBy(e => e.FirstName),
            "email" => descending ? query.OrderByDescending(e => e.Email) : query.OrderBy(e => e.Email),
            "salary" => descending ? query.OrderByDescending(e => e.Salary) : query.OrderBy(e => e.Salary),
            "hiredate" => descending ? query.OrderByDescending(e => e.HireDate) : query.OrderBy(e => e.HireDate),
            "code" => descending ? query.OrderByDescending(e => e.Code) : query.OrderBy(e => e.Code),
            _ => descending ? query.OrderByDescending(e => e.LastName) : query.OrderBy(e => e.LastName)
        };
    }
}
