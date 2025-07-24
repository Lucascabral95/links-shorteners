import { Controller, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GetUserStatsDto, PaginationUserDto, ResponseUpdateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-guard.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto';

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users with their respective information such as id, email, full name, role, verified status, created and updated at dates, googleId, picture, provider, links and clicks',
  })
  @ApiResponse({ status: 200, type: [GetUserDto] })
  @ApiResponse({ status: 404, type: "Users not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  findAll(@Query() paginationUserDto: PaginationUserDto) {
    return this.usersService.findAll(paginationUserDto);
  }

  @Get('quantity/resource/:id')
  @ApiOperation({
    summary: 'Get quantity of resources by user',
    description: 'Get quantity of links and clicks by user',
  })
  // @ApiResponse({ status: 200, type: { links: number, clicks: number } })
  @ApiResponse({ status: 404, type: "User not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  findQuantityResourceUser(@Param('id') id: string) {
    return this.usersService.findQuantityResourceUser(id);
  }

  @Get('data/:id')
  @ApiOperation({
    summary: 'Get current user with statistics',
    description: 'Retrieves the authenticated user information along with all their shortened URLs, registered clicks, and associated statistics. Includes metrics such as total number of created links and received clicks.'
  })
  @ApiResponse({ status: 200, type: GetUserStatsDto })
  @ApiResponse({ status: 404, type: "User not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  me(@Param('id') id: string) {
    return this.usersService.dataFindOne(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Get user by id with their respective information such as id, email, full name, role, verified status, created_at and updated_at dates, googleId, picture, provider, links and clicks',
  })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 404, type: "User not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by id',
    description: 'Modify user by id for the following fields: full_name, role and verified',
  })
  @ApiResponse({ status: 200, type: ResponseUpdateUserDto })
  @ApiResponse({ status: 404, type: "User not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Delete user by id',
  })
  @ApiResponse({ status: 200, type: "User deleted successfully" })
  @ApiResponse({ status: 404, type: "User not found" })
  @ApiResponse({ status: 500, type: "Internal server error" })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
