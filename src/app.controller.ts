import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
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
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 500, type: String })
  generateGlobalSeed() {
    return this.appService.generateGlobalSeed();
  }
}
