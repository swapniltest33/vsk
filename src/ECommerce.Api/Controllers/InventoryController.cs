using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Vendor")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService) => _inventoryService = inventoryService;

    [HttpPost("adjust")]
    public async Task<ActionResult> Adjust([FromBody] InventoryAdjustmentRequest request, CancellationToken ct)
    {
        var userId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : (int?)null;
        var success = await _inventoryService.AdjustStockAsync(request, userId, ct);
        return success ? NoContent() : BadRequest("Invalid product or insufficient stock for negative adjustment");
    }

    [HttpGet("history/{productId:int}")]
    public async Task<ActionResult<IEnumerable<object>>> GetHistory(int productId, CancellationToken ct)
    {
        var history = await _inventoryService.GetAdjustmentHistoryAsync(productId, ct);
        return Ok(history);
    }
}
