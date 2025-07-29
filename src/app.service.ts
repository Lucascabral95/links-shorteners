import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { OnModuleInit } from '@nestjs/common';
import { handlePrismaError } from './utils/prisma-error-handler';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from 'generated/prisma/runtime/library';
import { mockClicks, mockLinks, mockUsers } from './mock';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { envs } from './config/envs';

const API_LOCATION = envs.urlGeolocation;
const API_LOCATION_DEVELOPMENT = envs.urlGeolocationDevelopment;
const NODE_ENV = envs.nodeEnv;

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {

  constructor(private httpService: HttpService) {
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

      await Promise.all([
        this.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`,
        this.$executeRaw`TRUNCATE TABLE "Link" RESTART IDENTITY CASCADE;`,
        this.$executeRaw`TRUNCATE TABLE "Click" RESTART IDENTITY CASCADE;`,
      ])

      await this.user.createMany({
        data: mockUsers.map((u) => {
          return {
            ...u,
            password: bcrypt.hashSync(u.password, 10),
          }
        }),
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

      console.log(`Seeded executed successfully`)
      return 'Seeded executed successfully'
    } catch (error) {
      if (error instanceof Error || error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError) {
        throw new handlePrismaError(error, 'generateGlobalSeed');
      }
      throw new handlePrismaError(error, 'generateGlobalSeed');
    }
  }
}
