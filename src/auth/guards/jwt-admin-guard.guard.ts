import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtGuard } from "./jwt-guard.guard";
import { Role } from "generated/prisma";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAdminGuard extends JwtGuard {
    constructor(
        private reflector: Reflector,
        jwtService: JwtService
    ) {
        super(jwtService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new UnauthorizedException('User not found or without role assigned');
        }

        if (!requiredRoles.includes(user.role)) {
            throw new UnauthorizedException(
                `Access denied. Required roles: ${requiredRoles.join(', ')}. Current role: ${user.role}`
            );
        }

        return true;
    }
}
