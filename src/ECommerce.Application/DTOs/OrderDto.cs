namespace ECommerce.Application.DTOs;

public record OrderDto(
    int Id,
    int UserId,
    string UserName,
    DateTime OrderDate,
    string Status,
    string? ShippingAddress,
    decimal TotalAmount,
    List<OrderItemDto> Items
);

public record OrderItemDto(int ProductId, string ProductName, int Quantity, decimal Price);

public record CreateOrderRequest(List<OrderItemRequest> Items, string? ShippingAddress = null);
public record OrderItemRequest(int ProductId, int Quantity);

public record UpdateOrderStatusRequest(string Status);
