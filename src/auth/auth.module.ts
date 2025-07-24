import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';
import { UsersService } from 'src/users/users.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    UsersService,
    GoogleStrategy],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.secretJwt,
      signOptions: {
        expiresIn: "30d"
      }
    }),
    UsersModule,
  ]
})
export class AuthModule { }
