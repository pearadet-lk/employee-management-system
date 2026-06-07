using EmployeeManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ViewerOrAbove")]
public class DepartmentsController(IDepartmentService departmentService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDepartments(CancellationToken cancellationToken)
    {
        var departments = await departmentService.GetAllAsync(cancellationToken);
        return Ok(departments);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDepartment(int id, CancellationToken cancellationToken)
    {
        var department = await departmentService.GetByIdAsync(id, cancellationToken);
        return Ok(department);
    }

    [HttpGet("{id:int}/employees")]
    public async Task<IActionResult> GetDepartmentEmployees(int id, CancellationToken cancellationToken)
    {
        var department = await departmentService.GetByIdAsync(id, cancellationToken);
        return Ok(department.Employees);
    }
}
