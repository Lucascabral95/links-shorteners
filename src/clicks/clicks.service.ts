import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateClickDto, UpdateClickDto } from './dto';
import { PrismaClient } from 'generated/prisma';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { LinksService } from 'src/links/links.service';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import axios from 'axios';

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

  async findAll() {
    try {
      const allClicks = await this.click.findMany({
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

      if (!allClicks) {
        throw new NotFoundException('Clicks not found');
      }

      return allClicks;
    } catch (error) {
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
}
