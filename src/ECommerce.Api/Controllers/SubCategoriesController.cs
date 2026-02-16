using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubCategoriesController : ControllerBase
{
    private readonly ISubCategoryService _subCategoryService;

    public SubCategoriesController(ISubCategoryService subCategoryService) => _subCategoryService = subCategoryService;

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetAll([FromQuery] int? categoryId, CancellationToken ct)
    {
        return Ok(await _subCategoryService.GetAllAsync(categoryId, ct));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<SubCategoryDto>> GetById(int id, CancellationToken ct)
    {
        var subCategory = await _subCategoryService.GetByIdAsync(id, ct);
        return subCategory == null ? NotFound() : Ok(subCategory);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<SubCategoryDto>> Create([FromBody] CreateSubCategoryRequest request, CancellationToken ct)
    {
        var subCategory = await _subCategoryService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = subCategory.Id }, subCategory);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<SubCategoryDto>> Update(int id, [FromBody] UpdateSubCategoryRequest request, CancellationToken ct)
    {
        var subCategory = await _subCategoryService.UpdateAsync(id, request, ct);
        return subCategory == null ? NotFound() : Ok(subCategory);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _subCategoryService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
