namespace ECommerce.Application.DTOs;

public record PaymentRequest(int OrderId, decimal Amount, string PaymentMethod);
public record PaymentResponse(bool Success, string? TransactionId, string? Message);
