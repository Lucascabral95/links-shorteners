import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Headers } from '@nestjs/common';
import { ClicksService } from './clicks.service';
import { UpdateClickDto, CreateAutoClickDto, ResponseCreateAutoClickDto, GetClicksDto, ResponseUpdateAutoClickDto, PaginationClickDto, GetClickStatsByIdResponseDto } from './dto';
import { Request } from 'express';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAdminGuard } from 'src/auth/guards/jwt-admin-guard.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma';

@ApiTags('Clicks')
@Controller('clicks')
export class ClicksController {
  constructor(private readonly clicksService: ClicksService) { }

  @Post()
  @UseGuards(JwtAdminGuard)
  @ApiOperation({
    summary: 'Create click',
    description: 'Create click with user who made click, url of click, and user information: ip address, user agent, country and city, device type and browser'
  })
  @ApiResponse({ status: 201, type: ResponseCreateAutoClickDto })
  @ApiResponse({ status: 400, type: BadRequestException })
  @ApiResponse({ status: 404, type: NotFoundException })
  create(@Body() createAutoClickDto: CreateAutoClickDto, @Req() req: Request) {
    const { linkId, userId } = createAutoClickDto;
    return this.clicksService.recordAutoClick(linkId, req, userId);
  }

  @Get()
  @UseGuards(JwtAdminGuard)
  @ApiOperation({
    summary: 'Get all clicks',
    description: 'Get all clicks created with all their information',
  })
  @ApiResponse({ status: 200, type: [GetClicksDto] })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  findAll(@Query() paginationClickDto: PaginationClickDto) {
    return this.clicksService.findAll(paginationClickDto);
  }

  @Get('request/data')
  @ApiOperation({
    summary: 'Get click data by request',
    description: 'Get click data by request',
  })
  @ApiResponse({ status: 200, type: GetClicksDto })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  getHeaderRequestData(@Req() ip: Request, @Headers('user-agent') userAgent: string,
    @Query('short') short: string, @Query('uid') uid?: string) {
    return this.clicksService.getHeaderRequestData(ip, userAgent, short, uid);
  }

  @Get('stats/:id')
  @UseGuards(JwtAdminGuard)
  @ApiOperation({
    summary: 'Get click stats by id',
    description: 'Get click stats by id',
  })
  @ApiResponse({ status: 200, type: GetClickStatsByIdResponseDto })
  @ApiResponse({ status: 404, type: "Link not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  findOneStats(@Param('id') id: string) {
    return this.clicksService.getClicktatsById(id);
  }

  @Get(':linkId')
  @UseGuards(JwtAdminGuard)
  @ApiOperation({
    summary: 'Get click by id',
    description: 'Get information about a click',
  })
  @ApiResponse({ status: 200, type: GetClicksDto })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  findOne(@Param('linkId') linkId: string) {
    return this.clicksService.findOne(linkId);
  }

  @Patch(':linkId')
  @UseGuards(JwtAdminGuard)
  @ApiOperation({
    summary: 'Update click',
    description: 'Update click with user who made click, url of click, and user information: ip address, user agent, country and city, device type and browser',
  })
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, type: ResponseUpdateAutoClickDto })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  update(@Param('linkId') linkId: string, @Body() updateClickDto: UpdateClickDto) {
    return this.clicksService.update(linkId, updateClickDto);
  }

  @Delete(':linkId')
  @UseGuards(JwtAdminGuard)
  @ApiOperation({
    summary: 'Delete click',
    description: 'Delete click with user who made click, url of click, and user information',
  })
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, type: "Click deleted successfully" })
  @ApiResponse({ status: 404, type: NotFoundException })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  remove(@Param('linkId') linkId: string) {
    return this.clicksService.remove(linkId);
  }
}
