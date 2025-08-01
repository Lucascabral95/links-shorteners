import { Injectable, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { CreateLinkDto, UpdateLinkDto, VerifyPasswordLinkDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { PaginationLinkDto } from './dto/pagination-link.dto';
import { envs } from 'src/config/envs';
import { WhereGetLinkDto } from './dto/where-get-link-dto';

const LINKS_FILTER_QUANTITY = envs.linksFilterQuantity;

@Injectable()
export class LinksService extends PrismaClient implements OnModuleInit {

  constructor(private readonly usersService: UsersService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async create(createLinkDto: CreateLinkDto) {
    const { userId } = createLinkDto;

    try {

      await this.usersService.findOne(userId);

      const newLink = await this.link.create({
        data: createLinkDto
      });

      return {
        linkCreated: newLink,
        message: "Link created successfully"
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new handlePrismaError(error, 'Link');
    }
  }

  async findAll(paginationLinkDto: PaginationLinkDto) {
    try {
      const { page = 1, limit = LINKS_FILTER_QUANTITY, search, title, customAlias, isActive, isPublic, userId } = paginationLinkDto;

      const where: WhereGetLinkDto = {}

      if (search) {
        where.originalUrl = {
          contains: search,
          mode: 'insensitive',
        };
      }

      if (title) {
        where.title = {
          contains: title,
          mode: 'insensitive',
        };
      }

      if (customAlias) {
        where.customAlias = {
          contains: customAlias,
          mode: 'insensitive',
        };
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (isPublic !== undefined) {
        where.isPublic = isPublic;
      }

      if (userId) {
        where.userId = userId;
      }

      const [totalLinks, allLinks] = await Promise.all([
        this.link.count({
          where: where
        }),
        this.link.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            created_at: 'desc',
          },
          include: {
            clicks: true,
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
                role: true,
                verified: true,
                created_at: true,
                updated_at: true,
                googleId: true,
                picture: true,
                provider: true,
              }
            },
          }
        })
      ])

      const totalPages = Math.ceil(totalLinks / limit);

      return {
        quantityLinks: totalLinks,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        links: allLinks
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      return handlePrismaError(error, 'Link');
    }
  }

  async findOne(id: string) {
    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          id: id,
        }
      });

      return link;
    } catch (error) {
      throw new handlePrismaError(error, 'Link', id);
    }
  }

  async findOneByShortCode(shortCode: string) {
    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          shortCode: shortCode,
        }
      });

      if (!link) {
        throw new NotFoundException('Link not found');
      }

      return link;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new handlePrismaError(error, 'Link', shortCode);
    }
  }

  async update(id: string, updateLinkDto: UpdateLinkDto) {
    await this.findOne(id);

    const hasFieldsToUpdate = Object.keys(updateLinkDto).length > 0;
    if (!hasFieldsToUpdate) {
      throw new BadRequestException('No hay campos para actualizar');
    }

    const { originalUrl, shortCode, customAlias } = updateLinkDto;

    if (originalUrl) {
      await this.originalUrlAvailable(originalUrl);
    }

    if (shortCode) {
      await this.shortCodeAvailable(shortCode);
    }

    if (customAlias) {
      await this.customAliasAvailable(customAlias);
    }

    try {
      const updatedLink = await this.link.update({
        where: {
          id: id,
        },
        data: updateLinkDto,
      });

      return {
        linkUpdated: updatedLink,
        message: "Link updated successfully"
      };
    } catch (error) {
      console.log(error)
      throw new handlePrismaError(error, 'Link');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const deletedLink = await this.link.delete({
        where: {
          id: id,
        }
      });

      return {
        message: `Link ${deletedLink.originalUrl} - ALIAS ${deletedLink.shortCode}, deleted successfully`
      };
    } catch (error) {
      throw new handlePrismaError(error, 'Link', id);
    }
  }

  async shortCodeAvailable(shortCode: string) {
    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          shortCode: shortCode,
        }
      });

      if (link) {
        throw new BadRequestException('Short code already exists');
      }

      return link;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2025') {
        return null;
      }
      throw new handlePrismaError(error, 'Link', shortCode);
    }
  }

  async customAliasAvailable(customAlias: string) {
    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          customAlias: customAlias,
        }
      });

      if (link) {
        throw new BadRequestException('Custom alias already exists');
      }

      return link;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2025') {
        return null;
      }
      throw new handlePrismaError(error, 'Link', customAlias);
    }
  }

  async originalUrlAvailable(originalUrl: string) {
    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          originalUrl: originalUrl,
        }
      });

      if (link) {
        throw new BadRequestException('Original url already exists');
      }

      return link;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2025') {
        return null;
      }
      throw new handlePrismaError(error, 'Link');
    }
  }

  async findOneSimple() {
    try {
      const [total, link] = await Promise.all([
        this.link.count(),
        this.link.findMany()
      ])

      return {
        totalLinks: total,
        links: link
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new handlePrismaError(error, 'Link');
    }
  }

  // Stats of link by id
  async findOneStats(id: string) {
    await this.findOne(id);

    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          id: id,
        },
        include: {
          user: true,
        }
      });

      const [totalClicks, countries, cities, devices, browsers] = await Promise.all([
        this.click.count({
          where: {
            linkId: id,
          }
        }),
        this.click.groupBy({
          by: ['country'],
          _count: {
            country: true,
          },
          where: {
            linkId: id,
          },
        }),
        this.click.groupBy({
          by: ['city'],
          _count: {
            city: true,
          },
          where: {
            linkId: id,
          },
        }),
        this.click.groupBy({
          by: ['device'],
          _count: {
            device: true,
          },
          where: {
            linkId: id,
          },
        }),
        this.click.groupBy({
          by: ['browser'],
          _count: {
            browser: true,
          },
          where: {
            linkId: id,
          },
        })
      ])

      return {
        link,
        totalClicks,
        countries,
        cities,
        devices,
        browsers,
      };
    } catch (error) {
      throw new handlePrismaError(error, 'Link', id);
    }
  }

  // VerifyPassword 
  async verifyHavePassword(shortCode: string) {
    await this.findOneByShortCode(shortCode)

    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          shortCode: shortCode,
        },
      })

      if (!link.password) {
        throw new BadRequestException('Link does not have a password');
      }

      return {
        status: 200,
        message: 'Link password verified successfully',
        data: {
          verified: true,
          link: link.title
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new handlePrismaError(error, 'Link', shortCode);
    }
  }

  async verifyPassword(shortCode: string, verifyPasswordLinkDto: VerifyPasswordLinkDto) {
    await this.findOneByShortCode(shortCode)

    try {
      const link = await this.link.findFirstOrThrow({
        where: {
          shortCode: shortCode,
        },
      })

      if (!link.password) {
        throw new BadRequestException('Link does not have a password');
      }

      if (link.password !== verifyPasswordLinkDto.password) {
        throw new BadRequestException('Invalid password');
      }

      return {
        status: 200,
        message: 'Link password verified successfully',
        data: {
          verified: true,
          link: link.title
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new handlePrismaError(error, 'Link', shortCode);
    }
  }
}
