import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { envs } from '../../config/envs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private authService: AuthService,
    ) {
        super({
            clientID: envs.googleClientId,
            clientSecret: envs.googleClientSecret,
            callbackURL: envs.loginSessionCallback,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const { name, emails, photos } = profile;

        const user = await this.authService.validateOrCreateGoogleUser({
            email: emails[0].value,
            full_name: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
            googleId: profile.id,
        });

        done(null, user);
    }
}