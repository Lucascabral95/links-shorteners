import { Module } from '@nestjs/common';
import { ClicksService } from './clicks.service';
import { ClicksController } from './clicks.controller';
import { UsersService } from 'src/users/users.service';
import { LinksService } from 'src/links/links.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ClicksController],
  providers: [ClicksService, UsersService, LinksService],
  exports: [ClicksService],
})
export class ClicksModule { }
