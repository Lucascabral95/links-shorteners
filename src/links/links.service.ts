import { Injectable, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import { UsersService } from 'src/users/users.service';

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

  async findAll() {
    try {
      const allLinks = await this.link.findMany();

      return allLinks;
    } catch (error) {
      throw new handlePrismaError(error, 'Link');
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

  async update(id: string, updateLinkDto: UpdateLinkDto) {
    await this.findOne(id);

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

}
