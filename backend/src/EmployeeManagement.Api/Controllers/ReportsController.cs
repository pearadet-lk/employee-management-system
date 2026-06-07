using EmployeeManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ViewerOrAbove")]
public class ReportsController(IReportService reportService) : ControllerBase
{
    [HttpGet("by-department")]
    public async Task<IActionResult> ByDepartment(CancellationToken cancellationToken)
    {
        var data = await reportService.GetEmployeesByDepartmentAsync(cancellationToken);
        return Ok(data);
    }

    [HttpGet("by-salary-range")]
    public async Task<IActionResult> BySalaryRange(CancellationToken cancellationToken)
    {
        var data = await reportService.GetEmployeesBySalaryRangeAsync(cancellationToken);
        return Ok(data);
    }

    [HttpGet("hiring-trend")]
    public async Task<IActionResult> HiringTrend([FromQuery] int months = 12, CancellationToken cancellationToken = default)
    {
        var data = await reportService.GetHiringTrendAsync(months, cancellationToken);
        return Ok(data);
    }
}
