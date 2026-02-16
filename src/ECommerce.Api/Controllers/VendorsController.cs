using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly IVendorService _vendorService;

    public VendorsController(IVendorService vendorService) => _vendorService = vendorService;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<VendorDto>>> GetAll(CancellationToken ct)
    {
        var vendors = await _vendorService.GetAllAsync(ct);
        return Ok(vendors);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<VendorDto>> GetById(int id, CancellationToken ct)
    {
        var vendor = await _vendorService.GetByIdAsync(id, ct);
        return vendor == null ? NotFound() : Ok(vendor);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<VendorDto>> Create([FromBody] CreateVendorRequest request, CancellationToken ct)
    {
        var vendor = await _vendorService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = vendor.Id }, vendor);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<VendorDto>> Update(int id, [FromBody] UpdateVendorRequest request, CancellationToken ct)
    {
        var vendor = await _vendorService.UpdateAsync(id, request, ct);
        return vendor == null ? NotFound() : Ok(vendor);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _vendorService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
