import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateClickDto, PaginationClickDto, UpdateClickDto, WhereClicksDto } from './dto';
import { PrismaClient } from 'generated/prisma';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { LinksService } from 'src/links/links.service';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import axios from 'axios';
import { envs } from 'src/config/envs';

const LINKS_FILTER_QUANTITY = envs.linksFilterQuantity;

@Injectable()
export class ClicksService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ClicksService.name);

  constructor(private readonly linksService: LinksService, private readonly usersService: UsersService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('ClicksService initialized');
  }

  async findAll(paginationClickDto: PaginationClickDto) {
    try {
      const { page = 1, limit = LINKS_FILTER_QUANTITY, country, city, device, browser, userId } = paginationClickDto;

      const where: WhereClicksDto = {};

      if (country) {
        where.country = {
          contains: country,
          mode: 'insensitive',
        };
      }

      if (city) {
        where.city = {
          contains: city,
          mode: 'insensitive',
        };
      }

      if (device) {
        where.device = {
          contains: device,
          mode: 'insensitive',
        };
      }

      if (browser) {
        where.browser = {
          contains: browser,
          mode: 'insensitive',
        };
      }

      if (userId) {
        where.userId = userId;
      }

      const [totalClicks, clicks] = await Promise.all([
        this.click.count({ where }),
        this.click.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            created_at: 'desc'
          },
          include: {
            link: {
              select: {
                id: true,
                shortCode: true,
                originalUrl: true,
                title: true,
                description: true,
                expiresAt: true,
                isActive: true,
                isPublic: true,
                category: true,
                created_at: true,
                updated_at: true,
                userId: true,
              }
            },
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
              }
            }
          }
        })
      ])

      const totalPages = Math.ceil(totalClicks / limit);

      return {
        quantityClicks: totalClicks,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        clicks: clicks,
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error, 'Click');
    }
  }

  async findOne(linkId: string) {
    try {
      const click = await this.click.findUnique({
        where: {
          id: linkId
        },
        include: {
          link: {
            select: {
              id: true,
              shortCode: true,
              originalUrl: true,
              title: true,
              description: true,
              expiresAt: true,
              isActive: true,
              isPublic: true,
              category: true,
              created_at: true,
              updated_at: true,
              userId: true,
            }
          },
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            }
          }
        }
      });

      if (!click) {
        throw new NotFoundException('Click not found');
      }

      return click;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      return handlePrismaError(error, 'Click', linkId);
    }
  }

  async update(linkId: string, updateClickDto: UpdateClickDto) {
    await this.findOne(linkId);

    try {
      const updatedClick = await this.click.update({
        where: { id: linkId },
        data: updateClickDto,
      });

      return {
        clickUpdated: updatedClick,
        message: "Click updated successfully"
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      return handlePrismaError(error, 'Click', linkId);
    }
  }

  async remove(linkId: string) {
    await this.findOne(linkId);

    try {
      await this.click.delete({
        where: {
          id: linkId
        }
      });

      return {
        message: "Click deleted successfully"
      };
    } catch (error) {
      return handlePrismaError(error, 'Click', linkId);
    }
  }

  async create(createClickDto: CreateClickDto) {
    await this.linksService.findOne(createClickDto.linkId);
    await this.usersService.findOne(createClickDto.userId);

    try {
      const newClick = await this.click.create({
        data: {
          linkId: createClickDto.linkId,
          userId: createClickDto.userId,
          ipAddress: createClickDto.ipAddress,
          userAgent: createClickDto.userAgent,
          country: createClickDto.country || null,
          city: createClickDto.city || null,
          device: createClickDto.device || null,
          browser: createClickDto.browser || null,
        },
        include: {
          link: {
            select: {
              shortCode: true,
              originalUrl: true,
              title: true,
            }
          },
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            }
          }
        }
      })

      return {
        clickCreated: newClick,
        message: "Click created successfully"
      }

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      return handlePrismaError(error, 'Click');
    }
  }

  // Metodo para registrar clicks automaticamente
  async recordAutoClick(linkId: string, req: Request, userId: string) {
    const clickData: CreateClickDto = {
      linkId: linkId,
      userId: userId,
      ipAddress: this.getClientIP(req),
      userAgent: req.headers['user-agent'] || 'Unknown',
      ...this.parseUserAgent(req.headers['user-agent'] || 'Unknown'),
      ...await this.getLocationFromIP(this.getClientIP(req)),
    }

    await this.create(clickData);

    return {
      data: clickData,
      message: "Click registered successfully"
    }
  }

  private getClientIP(req: Request): string {
    return (
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '0.0.0.0'
    ).split(',')[0].trim();
  }

  private parseUserAgent(userAgent: string) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      device: result.device?.type || 'desktop',
      browser: result.browser?.name || 'unknown',
    };
  }

  private async getLocationFromIP(ip: string) {
    try {
      if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
        return { country: null, city: null }
      }

      const response = await axios.get(`https://ip-api.com/json/${ip}`)

      return {
        country: response.data.country || null,
        city: response.data.city || null
      }

    } catch (error) {
      return { country: null, city: null }
    }
  }

  async getClicktatsById(clickId: string) {
    try {
      const click = await this.click.findFirstOrThrow({
        where: {
          id: clickId
        },
        include: {
          link: {
            select: {
              id: true,
              shortCode: true,
              originalUrl: true,
              title: true,
              customAlias: true,
              description: true,
              expiresAt: true,
              isActive: true,
              isPublic: true,
              category: true,
              created_at: true,
              updated_at: true,
            }
          },
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            }
          }
        }
      });

      const [totalClicks, clicks, byCountry, byCity, byDevice, byBrowser, timeSeries] = await Promise.all([
        this.click.count({
          where: {
            linkId: click.linkId
          }
        }),
        this.click.findMany({
          where: {
            linkId: click.linkId,
          },
          orderBy: {
            created_at: 'desc'
          }
        }),
        this.click.groupBy({
          by: ['country'],
          where: {
            linkId: click.linkId
          },
          _count: {
            country: true
          },
          orderBy: { _count: { country: 'desc' } },
          take: 5
        }),
        this.click.groupBy({
          by: ['city'],
          where: {
            linkId: click.linkId
          },
          _count: {
            city: true
          },
          orderBy: { _count: { city: 'desc' } },
          take: 5
        }),
        this.click.groupBy({
          by: ['device'],
          where: {
            linkId: click.linkId
          },
          _count: {
            device: true
          },
          orderBy: { _count: { device: 'desc' } }
        }),
        this.click.groupBy({
          by: ['browser'],
          where: {
            linkId: click.linkId
          },
          _count: {
            browser: true
          },
          orderBy: { _count: { browser: 'desc' } }
        }),
        this.click.groupBy({
          by: ['created_at'],
          where: {
            linkId: click.linkId,
            created_at: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          _count: {
            created_at: true
          },
          orderBy: { created_at: 'asc' }
        })
      ]);

      return {
        click: click,
        totalClicks,
        metrics: {
          byCountry: byCountry.map(c => ({ country: c.country, count: c._count.country })),
          byCity: byCity.map(c => ({ city: c.city, count: c._count.city })),
          byDevice: byDevice.map(d => ({ device: d.device, count: d._count.device })),
          byBrowser: byBrowser.map(b => ({ browser: b.browser, count: b._count.browser })),
          timeSeries: timeSeries.map(t => ({
            date: t.created_at,
            count: t._count.created_at
          }))
        },
        clicks: clicks.slice(0, 20)
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error, 'Click', clickId);
    }
  }
}
