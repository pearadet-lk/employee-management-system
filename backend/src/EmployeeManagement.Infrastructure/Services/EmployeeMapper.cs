using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Domain.Entities;
using System.Linq.Expressions;

namespace EmployeeManagement.Infrastructure.Services;

internal static class EmployeeMapper
{
    public static Expression<Func<Employee, EmployeeDto>> ProjectToDto =>
        e => new EmployeeDto(
            e.Id,
            e.Code,
            e.FirstName,
            e.LastName,
            e.Email,
            e.DepartmentId,
            e.Department.Name,
            e.Salary,
            e.HireDate,
            e.Status,
            e.CreatedAt,
            e.UpdatedAt);
}
