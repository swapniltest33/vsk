using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponse> ProcessPaymentAsync(PaymentRequest request, CancellationToken ct = default);
}
