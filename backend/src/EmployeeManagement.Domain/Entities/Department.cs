using EmployeeManagement.Domain.Common;

namespace EmployeeManagement.Domain.Entities;

public class Department : AuditableEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Employee> Employees { get; set; } = [];
}
