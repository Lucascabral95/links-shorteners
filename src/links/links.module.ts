import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, UsersService],
  exports: [LinksService],
})
export class LinksModule { }
