import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { Logger } from '@nestjs/common';
import { Period, QueryFilterAnalyticsTimeSeriesDto, QueryFilterAnalyticsTopLinksDto, TypePeriod } from './dto';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { envs } from 'src/config/envs';

const LINKS_FILTER_QUANTITY = envs.linksFilterQuantity;

@Injectable()
export class AnalyticsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('AnalyticsService connected to the database');
  }

  async getGeneralAnalytics() {
    if (!this.link || !this.click || !this.user) {
      throw new InternalServerErrorException('Database repositories not initialized');
    }

    try {
      const [
        totalLinks,
        totalClicks,
        totalUsers,
        distributionUsers
      ] = await Promise.all([
        this.link.count(),
        this.click.count(),
        this.user.count(),
        this.user.groupBy({
          by: ['role'],
          _count: {
            role: true
          }
        })
      ]);

      const [totalPremiumUsers, totalFreeUsers, totalGuestUsers, totalAdminUsers] =
        await Promise.all([
          this.user.count({ where: { role: 'PREMIUM' } }),
          this.user.count({ where: { role: 'FREE' } }),
          this.user.count({ where: { role: 'GUEST' } }),
          this.user.count({ where: { role: 'ADMIN' } })
        ]);

      if (totalUsers === 0 && (totalPremiumUsers + totalFreeUsers + totalGuestUsers + totalAdminUsers) > 0) {
        throw new InternalServerErrorException('Inconsistent user data detected');
      }

      return {
        totalLinks,
        totalClicks,
        totalUsers,
        totalPremiumUsers,
        totalFreeUsers,
        totalGuestUsers,
        totalAdminUsers,
        distributionUsers
      };
    } catch (error) {
      if (error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException) {
        throw error;
      }

      return handlePrismaError(error, 'Analytics', 'getGeneralAnalytics');
    }
  }

  async getTopLinks(query: QueryFilterAnalyticsTopLinksDto) {
    const { limit = 10000, page = 1, period = Period['30d'] } = query;
    const skip = (page - 1) * limit;

    const switchHours = (period: Period) => {
      switch (period) {
        case Period['1h']:
          return 1;
        case Period['12h']:
          return 12;
        case Period['24h']:
          return 24;
        case Period['7d']:
          return 7 * 24;
        case Period['30d']:
          return 30 * 24;
        case Period['90d']:
          return 90 * 24;
        case Period['1y']:
          return 365 * 24;
        default:
          return 24;
      }
    };

    try {
      const dateFilter = new Date(Date.now() - switchHours(period) * 60 * 60 * 1000);

      const totalUniqueLinks = await this.click.groupBy({
        where: {
          created_at: {
            gte: dateFilter,
          }
        },
        by: ['linkId'],
        _count: {
          linkId: true
        }
      });

      const totalTopLinks = totalUniqueLinks.length;
      const totalPages = Math.ceil(totalTopLinks / limit);

      const topLinksData = await this.click.groupBy({
        where: {
          created_at: {
            gte: dateFilter,
          }
        },
        by: ['linkId'],
        _count: {
          linkId: true
        },
        orderBy: {
          _count: {
            linkId: 'desc'
          }
        },
        take: limit,
        skip: skip
      });

      const linkIds = topLinksData.map(item => item.linkId);

      const linksWithDetails = await this.link.findMany({
        where: {
          id: { in: linkIds }
        },
        select: {
          id: true,
          originalUrl: true,
          shortCode: true,
          customAlias: true,
          title: true,
          description: true,
          isActive: true,
          isPublic: true,
          category: true,
          created_at: true,
          updated_at: true,
          userId: true
        }
      });

      const topLinks = topLinksData.map(clickData => {
        const linkDetail = linksWithDetails.find(link => link.id === clickData.linkId);
        return {
          ...linkDetail,
          clicksCount: clickData._count.linkId
        };
      }).filter(link => link.id);

      return {
        quantityLinks: totalTopLinks,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        topLinks: topLinks,
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      return handlePrismaError(error, 'Click', 'getTopLinks');
    }
  }

  async getGeographic() {
    try {
      const [countryData, cityData, deviceData, browserData, totalClicks] = await Promise.all([
        this.click.groupBy({
          by: ['country'],
          _count: { _all: true },
          where: { country: { not: null } },
          orderBy: { _count: { country: 'desc' } },
        }),

        this.click.groupBy({
          by: ['city'],
          _count: { _all: true },
          where: { city: { not: null } },
          orderBy: { _count: { city: 'desc' } },
        }),

        this.click.groupBy({
          by: ['device'],
          _count: { _all: true },
          where: { device: { not: null } },
          orderBy: { _count: { device: 'desc' } }
        }),

        this.click.groupBy({
          by: ['browser'],
          _count: { _all: true },
          where: { browser: { not: null } },
          orderBy: { _count: { browser: 'desc' } }
        }),

        this.click.count()
      ]);

      const validateValue = (value: string | null): string =>
        value?.trim() || 'No especificado';

      const countries = countryData.map(item => ({
        country: item.country,
        city: null,
        device: 'aggregated',
        browser: 'aggregated',
        _count: {
          country: item._count._all,
          city: 0,
          device: item._count._all,
          browser: item._count._all
        }
      }));

      const cities = cityData.map(item => ({
        country: null,
        city: item.city,
        device: 'aggregated',
        browser: 'aggregated',
        _count: {
          country: 0,
          city: item._count._all,
          device: item._count._all,
          browser: item._count._all
        }
      }));

      const devices = deviceData.map(item => ({
        country: null,
        city: null,
        device: validateValue(item.device),
        browser: 'aggregated',
        _count: {
          country: 0,
          city: 0,
          device: item._count._all,
          browser: 0
        }
      }));

      const browsers = browserData.map(item => ({
        country: null,
        city: null,
        device: 'aggregated',
        browser: validateValue(item.browser),
        _count: {
          country: 0,
          city: 0,
          device: 0,
          browser: item._count._all
        }
      }));

      const totalCountryClicks = countryData.reduce((sum, item) => sum + item._count._all, 0);
      const totalCityClicks = cityData.reduce((sum, item) => sum + item._count._all, 0);
      const totalDeviceClicks = deviceData.reduce((sum, item) => sum + item._count._all, 0);
      const totalBrowserClicks = browserData.reduce((sum, item) => sum + item._count._all, 0);

      return {
        geographic: countries,
        countries: countries,
        cities: cities,
        devices: devices,
        browsers: browsers,

        stats: {
          uniqueCountries: countryData.length,
          uniqueCities: cityData.length,
          uniqueDevices: deviceData.length,
          uniqueBrowsers: browserData.length,

          countryClicks: totalCountryClicks,
          cityClicks: totalCityClicks,
          deviceClicks: totalDeviceClicks,
          browserClicks: totalBrowserClicks,

          totalClicks: totalClicks,

          topCountry: countries[0]?.country || 'N/A',
          topCity: cities[0]?.city || 'N/A',
          topDevice: devices[0]?.device || 'N/A',
          topBrowser: browsers[0]?.browser || 'N/A',

          countryDistribution: countryData.map(item => ({
            country: item.country,
            clicks: item._count._all,
            percentage: ((item._count._all / totalCountryClicks) * 100).toFixed(2)
          })),

          deviceDistribution: deviceData.map(item => ({
            device: validateValue(item.device),
            clicks: item._count._all,
            percentage: ((item._count._all / totalDeviceClicks) * 100).toFixed(2)
          })),

          browserDistribution: browserData.map(item => ({
            browser: validateValue(item.browser),
            clicks: item._count._all,
            percentage: ((item._count._all / totalBrowserClicks) * 100).toFixed(2)
          }))
        },

        rankings: {
          topCountries: countryData.slice(0, 10).map((item, index) => ({
            rank: index + 1,
            country: item.country,
            clicks: item._count._all,
            percentage: ((item._count._all / totalCountryClicks) * 100).toFixed(2)
          })),

          topCities: cityData.slice(0, 10).map((item, index) => ({
            rank: index + 1,
            city: item.city,
            clicks: item._count._all,
            percentage: ((item._count._all / totalCityClicks) * 100).toFixed(2)
          })),

          topDevices: deviceData.slice(0, 5).map((item, index) => ({
            rank: index + 1,
            device: validateValue(item.device),
            clicks: item._count._all,
            percentage: ((item._count._all / totalDeviceClicks) * 100).toFixed(2)
          })),

          topBrowsers: browserData.slice(0, 10).map((item, index) => ({
            rank: index + 1,
            browser: validateValue(item.browser),
            clicks: item._count._all,
            percentage: ((item._count._all / totalBrowserClicks) * 100).toFixed(2)
          }))
        },

        metadata: {
          queryLimit: LINKS_FILTER_QUANTITY,
          timestamp: new Date().toISOString(),
          dataIntegrity: {
            countriesWithoutCities: countryData.length - new Set(cityData.map(c => c.city)).size,
            citiesWithoutCountry: 0,
            hasIncompleteData: totalCountryClicks !== totalClicks
          }
        }
      };

    } catch (error) {
      if (error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException) {
        throw error;
      }
      return handlePrismaError(error, 'Geographic', 'getGeographic');
    }
  }

  async getConversionRate() {
    try {
      const totalLinks = await this.link.count();
      const totalClicks = await this.click.count();

      if (totalLinks === 0) {
        return {
          message: "No hay enlaces registrados en el sistema",
          totalLinks: 0,
          totalClicks: 0,
          conversionRate: 0
        };
      }

      const conversionRate = totalClicks / totalLinks;
      const formattedRate = conversionRate.toFixed(2);
      const clickRatio = (totalClicks / totalLinks) * 100;
      const now = new Date();

      return {
        metrics: {
          totalLinks,
          totalClicks,
          conversionRate: formattedRate,
          clickRatio: `${clickRatio.toFixed(2)}%`,
          timestamp: now
        }
      };
    } catch (error) {
      console.error('Error al calcular la tasa de conversión:', error);
      throw new Error('No se pudo calcular la tasa de conversión');
    }
  }

  async getTimeSeries(query: QueryFilterAnalyticsTimeSeriesDto) {
    const { page, type = TypePeriod.daily, startDate, endDate, limit = LINKS_FILTER_QUANTITY } = query
    const skip = (page - 1) * limit

    try {
      const clicks = await this.link.findMany({
        where: {
          created_at: {
            gte: startDate ? new Date(startDate).toISOString() : undefined,
            lte: endDate ? new Date(endDate).toISOString() : undefined,
          },
        },
        take: limit,
        skip: skip,
        include: {
          clicks: {
            select: {
              id: true,
              linkId: true,
              userId: true,
              ipAddress: true,
              userAgent: true,
              country: true,
              city: true,
              device: true,
              browser: true,
              created_at: true,
              updated_at: true,
            },
          },
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      })

      const quantityClicks = clicks.length
      const totalPages = Math.ceil(quantityClicks / limit)

      return {
        quantityClicks: quantityClicks,
        totalPages: totalPages,
        currentPage: page,
        timeSeries: clicks,
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error)
      throw new BadRequestException('No se pudo obtener la serie de tiempo')
    }
  }
}