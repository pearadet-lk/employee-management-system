using EmployeeManagement.Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Api.Middleware;

public static class ExceptionHandlingExtensions
{
    public static void UseGlobalExceptionHandler(this WebApplication app)
    {
        app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
                var (status, title) = exception switch
                {
                    NotFoundException => (StatusCodes.Status404NotFound, "Not Found"),
                    InvalidOperationException => (StatusCodes.Status409Conflict, "Conflict"),
                    _ => (StatusCodes.Status500InternalServerError, "Server Error")
                };

                context.Response.StatusCode = status;
                context.Response.ContentType = "application/problem+json";

                var problem = new ProblemDetails
                {
                    Status = status,
                    Title = title,
                    Detail = exception?.Message,
                    Instance = context.Request.Path
                };

                await context.Response.WriteAsJsonAsync(problem);
            });
        });
    }
}

public class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string HeaderName = "X-Correlation-Id";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[HeaderName].FirstOrDefault() ?? Guid.NewGuid().ToString();
        context.Response.Headers[HeaderName] = correlationId;
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", correlationId))
        {
            await next(context);
        }
    }
}
