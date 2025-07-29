import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ClicksModule } from './clicks/clicks.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, UsersModule, LinksModule, AnalyticsModule, ClicksModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
