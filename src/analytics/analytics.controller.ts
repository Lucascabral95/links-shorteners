import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { QueryFilterAnalyticsTimeSeriesDto, QueryFilterAnalyticsTopLinksDto, ResponseConversionRateDto, TimeSeriesAnalyticsDto } from './dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GeneralAnalyticsDto, ResponseTopLinksDto, ResponseGeographicDto } from './dto';
import { JwtAdminGuard } from 'src/auth/guards/jwt-admin-guard.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAdminGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('general')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get general analytics',
    description: 'Get general analytics: total clicks, total links, total users, total premium users, total free users, total admin users, total guest users, and user distribution',
  })
  @ApiResponse({ status: 200, type: GeneralAnalyticsDto })
  @ApiResponse({ status: 400, type: 'Bad Request' })
  @ApiResponse({ status: 404, type: 'Not Found' })
  @ApiResponse({ status: 500, type: 'Interval Server Error' })
  getGeneralAnalytics() {
    return this.analyticsService.getGeneralAnalytics()
  }

  @Get('top-links')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get top links',
    description: 'Get the most clicked links with pagination and time period filtering. Returns paginated results including total links, total pages, current page, and top links ordered by click count. Supports time periods: 1h, 12h, 24h, 7d, 30d, 90d, 1y.'
  })
  @ApiResponse({ status: 200, type: ResponseTopLinksDto })
  @ApiResponse({ status: 400, type: 'Bad Request' })
  @ApiResponse({ status: 404, type: 'Not Found' })
  @ApiResponse({ status: 500, type: 'Interval Server Error' })
  getTopLinks(@Query() query: QueryFilterAnalyticsTopLinksDto) {
    return this.analyticsService.getTopLinks(query)
  }

  @Get('geographic')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get geographic analytics',
    description: 'Get geographic analytics data including country, city, device and browser distribution. Returns a list of geographic entries ordered by country count, including device and browser information for each location.'
  })
  @ApiResponse({ status: 200, type: ResponseGeographicDto })
  @ApiResponse({ status: 400, type: 'Bad Request' })
  @ApiResponse({ status: 404, type: 'Not Found' })
  @ApiResponse({ status: 500, type: 'Interval Server Error' })
  getGeographic() {
    return this.analyticsService.getGeographic()
  }

  @Get('conversion-rate')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get conversion rate',
    description: 'Get conversion rate metrics: total links, total clicks, conversion rate percentage for each click, and timestamp of calculation.'
  })
  @ApiResponse({ status: 200, type: ResponseConversionRateDto })
  @ApiResponse({ status: 400, type: 'Bad Request' })
  @ApiResponse({ status: 404, type: 'Not Found' })
  @ApiResponse({ status: 500, type: 'Interval Server Error' })
  getConversionRate() {
    return this.analyticsService.getConversionRate()
  }

  @Get('time-series')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get time series analytics',
    description: 'Get time series analytics with pagination. Returns paginated results of clicks including link information and user details, ordered by creation date. Supports filtering by date range and includes total records, pages, and current page information.'
  })
  @ApiResponse({ status: 200, type: TimeSeriesAnalyticsDto })
  @ApiResponse({ status: 400, type: 'Bad Request' })
  @ApiResponse({ status: 404, type: 'Not Found' })
  @ApiResponse({ status: 500, type: 'Interval Server Error' })
  getTimeSeries(@Query() query: QueryFilterAnalyticsTimeSeriesDto) {
    return this.analyticsService.getTimeSeries(query)
  }
}