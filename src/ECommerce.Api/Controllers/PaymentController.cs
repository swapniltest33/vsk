using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService) => _paymentService = paymentService;

    [HttpPost]
    public async Task<ActionResult<PaymentResponse>> ProcessPayment([FromBody] PaymentRequest request, CancellationToken ct)
    {
        var result = await _paymentService.ProcessPaymentAsync(request, ct);
        return Ok(result);
    }
}
