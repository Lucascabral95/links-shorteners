import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { UpdateUserDto, PaginationUserDto, WhereUserPaginationDto } from './dto';
import { PrismaClient } from 'generated/prisma';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { envs } from 'src/config/envs';

const LINKS_FILTER_QUANTITY = envs.linksFilterQuantity;

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findAll(paginationUserDto: PaginationUserDto) {
    try {
      const { page = 1, limit = LINKS_FILTER_QUANTITY, full_name, role, verified, provider } = paginationUserDto;

      const where: WhereUserPaginationDto = {};

      if (full_name) {
        where.full_name = {
          contains: full_name,
          mode: 'insensitive',
        };
      }

      if (role) {
        where.role = role;
      }

      if (verified !== undefined) {
        where.verified = verified;
      }

      if (provider) {
        where.provider = {
          contains: provider,
          mode: 'insensitive',
        };
      }

      const [totalUsers, allUsers] = await Promise.all([
        this.user.count({ where }),
        this.user.findMany({
          where,
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            created_at: 'desc',
          },
          select: {
            id: true,
            email: true,
            full_name: true,
            role: true,
            verified: true,
            created_at: true,
            updated_at: true,
            googleId: true,
            picture: true,
            provider: true,
            links: true,
            clicks: true,
          }
        })
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      return {
        quantityUsers: totalUsers,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        users: allUsers,
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      handlePrismaError(error, 'User');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.user.findFirstOrThrow({
        where: { id },
        select: {
          id: true,
          email: true,
          full_name: true,
          role: true,
          verified: true,
          created_at: true,
          updated_at: true,
          googleId: true,
          picture: true,
          provider: true,
          links: true,
          clicks: true,
        }
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return user;
    } catch (error) {
      throw new handlePrismaError(error, 'User', id);
    }
  }

  async dataFindOne(id: string) {
    await this.findOne(id);

    try {

      const [countLinks, countClicks, links, clicks] = await Promise.all([
        this.link.count({
          where: {
            userId: id,
          },
        }),
        this.click.count({
          where: {
            userId: id
          }
        }),
        this.link.findMany({
          where: {
            userId: id
          }
        }),
        this.click.findMany({
          where: {
            userId: id
          }
        })
      ]);

      return {
        stats: {
          quantityLinks: countLinks,
          quantityClicks: countClicks,
        },
        data: {
          links: links,
          clicks: clicks
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new handlePrismaError(error, 'User', id);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    try {
      const updatedUser = await this.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          full_name: true,
          role: true,
          verified: true,
          created_at: true,
          updated_at: true,
          links: true,
          clicks: true,
        }
      });

      return {
        data: updatedUser,
        message: "User updated successfully"
      };
    } catch (error) {
      console.log(error)
      throw new handlePrismaError(error, 'User', id);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.user.delete({
        where: { id }
      });

      return {
        message: "User deleted successfully"
      };
    } catch (error) {
      throw new handlePrismaError(error, 'User', id);
    }
  }

  async findQuantityResourceUser(id: string) {
    await this.findOne(id);

    try {
      const [countClicks, countLinks] = await Promise.all([
        this.click.count({
          where: {
            userId: id
          }
        }),
        this.link.count({
          where: {
            userId: id,
          },
        }),
      ])

      return {
        quantityClicks: countClicks,
        quantityLinks: countLinks,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new handlePrismaError(error, 'User', id);
    }
  }
}
