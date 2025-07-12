import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LinksModule } from './links/links.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ClicksModule } from './clicks/clicks.module';

@Module({
  imports: [AuthModule, UsersModule, LinksModule, AnalyticsModule, ClicksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
