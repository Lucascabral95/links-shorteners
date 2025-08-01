import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAdminGuard } from 'src/auth/guards/jwt-admin-guard.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from 'generated/prisma';

@Controller()
@UseGuards(JwtAdminGuard)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 500, type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 500, type: String })
  healthCheck() {
    return this.appService.healthCheck();
  }

  @Get('seed/global/generate')
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 500, type: String })
  generateGlobalSeed() {
    return this.appService.generateGlobalSeed();
  }
}
