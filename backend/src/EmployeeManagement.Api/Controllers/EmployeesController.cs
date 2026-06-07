using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ViewerOrAbove")]
public class EmployeesController(
    IEmployeeService employeeService,
    IValidator<CreateEmployeeRequest> createValidator,
    IValidator<UpdateEmployeeRequest> updateValidator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetEmployees([FromQuery] EmployeeQuery query, CancellationToken cancellationToken)
    {
        var result = await employeeService.GetEmployeesAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEmployee(int id, CancellationToken cancellationToken)
    {
        var employee = await employeeService.GetByIdAsync(id, cancellationToken);
        return Ok(employee);
    }

    [HttpPost]
    [Authorize(Policy = "HrOrAbove")]
    public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var validation = await createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(validation.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
        }

        try
        {
            var employee = await employeeService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "HrOrAbove")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var validation = await updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(validation.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
        }

        try
        {
            var employee = await employeeService.UpdateAsync(id, request, cancellationToken);
            return Ok(employee);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "HrOrAbove")]
    public async Task<IActionResult> DeleteEmployee(int id, CancellationToken cancellationToken)
    {
        await employeeService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
