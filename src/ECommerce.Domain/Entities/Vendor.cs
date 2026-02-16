namespace ECommerce.Domain.Entities;

public class Vendor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContactInfo { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
