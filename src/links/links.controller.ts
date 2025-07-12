import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GetLinksDto, ResponseCreateLinkDto, ResponseUpdateLinkDto } from './dto';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) { }

  @Post()
  @ApiOperation({
    summary: 'Create link',
    description: 'Create link with originalUrl, shortCode, category, userId, customAlias, title, description, password, isPublic, isActive and expiresAt',
  })
  @ApiResponse({ status: 200, type: ResponseCreateLinkDto })
  @ApiResponse({ status: 404, type: "Link not found" })
  @ApiResponse({ status: 400, type: "Link already exists" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all links',
    description: 'Get all links created with all their clicks information',
  })
  @ApiResponse({ status: 200, type: [GetLinksDto] })
  @ApiResponse({ status: 404, type: "Links not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get link by id',
    description: 'Get link by id',
  })
  @ApiResponse({ status: 200, type: GetLinksDto })
  @ApiResponse({ status: 404, type: "Link not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update link by id',
    description: 'Update link by id for the following fields: userId, originalUrl, shortCode, customAlias, title, description, password, expiresAt, isActive, isPublic, category',
  })
  @ApiResponse({ status: 200, type: ResponseUpdateLinkDto })
  @ApiResponse({ status: 404, type: "Link not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete link by id',
    description: 'Delete link by id',
  })
  @ApiResponse({ status: 200, type: "Link deleted successfully" })
  @ApiResponse({ status: 404, type: "Link not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
