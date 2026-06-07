using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        await context.Database.MigrateAsync(cancellationToken);

        if (await context.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        logger.LogInformation("Seeding database...");

        var departments = new[]
        {
            new Department { Name = "Engineering", Description = "Software and platform development" },
            new Department { Name = "Human Resources", Description = "People operations and talent" },
            new Department { Name = "Finance", Description = "Accounting and financial planning" },
            new Department { Name = "Sales", Description = "Revenue and customer acquisition" }
        };

        context.Departments.AddRange(departments);
        await context.SaveChangesAsync(cancellationToken);

        var employees = new List<Employee>();
        var random = new Random(42);
        var firstNames = new[] { "Alice", "Bob", "Carol", "David", "Eva", "Frank", "Grace", "Henry", "Ivy", "Jack", "Karen", "Leo", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rita", "Sam", "Tina" };
        var lastNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez" };

        for (var i = 1; i <= 20; i++)
        {
            var dept = departments[i % departments.Length];
            employees.Add(new Employee
            {
                Code = $"EMP-{i:D3}",
                FirstName = firstNames[i - 1],
                LastName = lastNames[i % lastNames.Length],
                Email = $"{firstNames[i - 1].ToLower()}.{lastNames[i % lastNames.Length].ToLower()}@company.com",
                DepartmentId = dept.Id,
                Salary = 45000 + random.Next(0, 55000),
                HireDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-random.Next(1, 36))),
                Status = i % 7 == 0 ? EmployeeStatus.OnLeave : EmployeeStatus.Active
            });
        }

        context.Employees.AddRange(employees);

        var users = new[]
        {
            CreateUser("admin", "admin@company.com", "Admin123!", UserRole.Admin),
            CreateUser("hr", "hr@company.com", "Hr123456!", UserRole.HR),
            CreateUser("viewer", "viewer@company.com", "Viewer123!", UserRole.Viewer)
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Database seeded successfully.");
    }

    private static ApplicationUser CreateUser(string username, string email, string password, UserRole role) =>
        new()
        {
            Username = username,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = role
        };
}
