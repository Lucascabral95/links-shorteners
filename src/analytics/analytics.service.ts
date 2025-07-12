import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { Logger } from '@nestjs/common';
import { Period, QueryFilterAnalyticsTimeSeriesDto, QueryFilterAnalyticsTopLinksDto } from './dto';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { envs } from 'src/config/envs';

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
    const { limit, page, period } = query;
    const skip = (page - 1) * limit

    const switchHours = (period: Period) => {
      switch (period) {
        case Period['1h']:
          return 1
        case Period['12h']:
          return 12
        case Period['24h']:
          return 24
        case Period['7d']:
          return 7 * 24
        case Period['30d']:
          return 30 * 24
        case Period['90d']:
          return 90 * 24
        case Period['1y']:
          return 365 * 24
        default:
          return 24
      }
    }

    try {
      const topLinks = await this.click.groupBy({
        where: {
          created_at: {
            gte: new Date(Date.now() - switchHours(period) * 60 * 60 * 1000),
          }
        },
        by: ['linkId', 'userId', 'created_at', 'updated_at'],
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
      })

      const quantityLinks = topLinks.length
      const totalPages = Math.ceil(quantityLinks / limit)

      return {
        quantityLinks: quantityLinks,
        totalPages: totalPages,
        currentPage: page,
        topLinks: topLinks,
      }
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      return handlePrismaError(error, 'Click', 'getTopLinks');
    }
  }

  async getGeographic() {
    try {
      const geographic = await this.click.groupBy({
        by: ['country', 'city', 'device', 'browser'],
        _count: {
          country: true,
        },
        orderBy: {
          _count: {
            country: 'desc'
          }
        },
        take: envs.linksFilterQuantity
      })

      return geographic
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      return handlePrismaError(error, 'Geographic', 'getGeographic');
    }
  }

  async getDeviceBrowserDistribution() {
    try {
      const deviceBrowserDistribution = await this.click.groupBy({
        by: ['device', 'browser', 'created_at'],
        _count: {
          device: true,
          browser: true,
        },
        orderBy: {
          _count: {
            device: 'desc'
          }
        }
      });

      const validateValue = (value: string | null) => {
        return value && typeof value === 'string' && value.trim() !== ''
          ? value.trim()
          : 'no especificado';
      };

      const processedDistribution = deviceBrowserDistribution.map(entry => ({
        device: validateValue(entry.device),
        browser: validateValue(entry.browser),
        created_at: entry.created_at,
        _count: entry._count
      }));

      const uniqueDevicesSet = new Set(processedDistribution.map(item => item.device));
      const uniqueBrowsersSet = new Set(processedDistribution.map(item => item.browser));

      const deviceStats = {
        totalDevices: uniqueDevicesSet.size,
        totalBrowsers: uniqueBrowsersSet.size,
        uniqueDevices: Array.from(uniqueDevicesSet),
        uniqueBrowsers: Array.from(uniqueBrowsersSet),
        totalRecords: processedDistribution.length
      };

      const deviceTotals = processedDistribution.reduce((acc, entry) => {
        const device = entry.device;
        acc[device] = (acc[device] || 0) + (entry._count.device || 0);
        return acc;
      }, {});

      return {
        // distribution: processedDistribution,
        deviceStats,
        deviceTotals,
        metadata: {
          queryLimit: 1,
          recordsReturned: processedDistribution.length,
          hasMoreData: processedDistribution.length === 1
        },
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      return handlePrismaError(error, 'DeviceBrowserDistribution', 'getDeviceBrowserDistribution');
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
    const { page, type, startDate, endDate, limit } = query
    const skip = (page - 1) * limit

    try {
      const clicks = await this.link.findMany({
        where: {
          created_at: {
            gte: startDate ? new Date(startDate).toISOString() : undefined,
            lte: endDate ? new Date(endDate).toISOString() : undefined,
          }
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