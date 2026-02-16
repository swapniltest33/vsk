using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;

namespace ECommerce.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    public Task<PaymentResponse> ProcessPaymentAsync(PaymentRequest request, CancellationToken ct = default)
    {
        // Stubbed implementation - always succeeds for testing
        var transactionId = $"TXN-{Guid.NewGuid():N}"[..20].ToUpperInvariant();
        return Task.FromResult(new PaymentResponse(true, transactionId, "Payment processed successfully (stub)"));
    }
}
