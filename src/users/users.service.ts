import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { PrismaClient } from 'generated/prisma';
import { handlePrismaError } from 'src/utils/prisma-error-handler';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findAll() {
    try {
      const allUsers = await this.user.findMany({
        include: {
          clicks: true,
          links: true,
        }
      });

      if (!allUsers) {
        throw new BadRequestException('Users not found');
      }

      return allUsers
    } catch (error) {
      throw new handlePrismaError(error, 'User');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.user.findFirstOrThrow({
        where: { id },
        include: {
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
}
