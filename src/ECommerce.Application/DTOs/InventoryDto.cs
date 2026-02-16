namespace ECommerce.Application.DTOs;

public record InventoryAdjustmentRequest(int ProductId, int QuantityChange, string Reason);
