using EmployeeManagement.Application.Common;
using EmployeeManagement.Application.DTOs;

namespace EmployeeManagement.Application.Interfaces;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeDto>> GetEmployeesAsync(EmployeeQuery query, CancellationToken cancellationToken = default);
    Task<EmployeeDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request, CancellationToken cancellationToken = default);
    Task<EmployeeDto> UpdateAsync(int id, UpdateEmployeeRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
