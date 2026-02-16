namespace ECommerce.Domain.Entities;

public class InventoryAdjustment
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int QuantityChange { get; set; }
    public string Reason { get; set; } = string.Empty;
    public int? AdjustedByUserId { get; set; }
    public DateTime AdjustedAt { get; set; } = DateTime.UtcNow;
    
    public Product Product { get; set; } = null!;
}
