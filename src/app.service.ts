import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { OnModuleInit } from '@nestjs/common';
import { handlePrismaError } from './utils/prisma-error-handler';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from 'generated/prisma/runtime/library';
import { mockClicks, mockLinks, mockUsers } from './mock';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  healthCheck(): string {
    return 'OK';
  }

  async generateGlobalSeed() {
    try {
      await this.$executeRaw`SET session_replication_role = replica;`

      await this.$executeRaw`TRUNCATE TABLE "clicks" RESTART IDENTITY CASCADE;`
      await this.$executeRaw`TRUNCATE TABLE "password_reset_tokens" RESTART IDENTITY CASCADE;`
      await this.$executeRaw`TRUNCATE TABLE "links" RESTART IDENTITY CASCADE;`
      await this.$executeRaw`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;`

      await this.$executeRaw`SET session_replication_role = origin;`

      await this.user.createMany({
        data: mockUsers.map((u) => ({
          ...u,
          password: bcrypt.hashSync(u.password, 10),
        })),
        skipDuplicates: true,
      })

      await this.link.createMany({
        data: mockLinks,
        skipDuplicates: true,
      })

      await this.click.createMany({
        data: mockClicks,
        skipDuplicates: true,
      })

      return 'Seeded executed successfully'
    } catch (error) {
      try {
        await this.$executeRaw`SET session_replication_role = origin;`
      } catch (rollbackError) {
        console.error('Error rolling back session_replication_role:', rollbackError)
      }

      console.error('Seed error details:', {
        code: error.code,
        message: error.message,
        meta: error.meta
      })

      if (error instanceof Error || error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
        throw new handlePrismaError(error, 'generateGlobalSeed');
      }
      throw new handlePrismaError(error, 'generateGlobalSeed');
    }
  }

  async generateGlobalSeedProduction() {
    try {
      await this.click.deleteMany({});
      await this.link.deleteMany({});
      await this.user.deleteMany({});

      await this.user.createMany({
        data: mockUsers.map((u) => ({
          ...u,
          password: bcrypt.hashSync(u.password, 10),
        })),
        skipDuplicates: true,
      });

      await this.link.createMany({
        data: mockLinks,
        skipDuplicates: true,
      });

      await this.click.createMany({
        data: mockClicks,
        skipDuplicates: true,
      });

      return 'Seeded executed successfully';

    } catch (error) {
      console.error('Seed error details:', {
        code: error.code,
        message: error.message,
        meta: error.meta
      });

      if (error instanceof Error || error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
        throw new handlePrismaError(error, 'generateGlobalSeed');
      }
      throw new handlePrismaError(error, 'generateGlobalSeed');
    }
  }
}
