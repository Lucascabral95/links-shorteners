import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { envs } from "src/config/envs";
import { PayloadJwtDto } from "../dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.secretJwt,
        })
    }

    async validate(payload: PayloadJwtDto) {
        const user = await this.userService.findOne(payload.id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
