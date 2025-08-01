import { Role } from "generated/prisma";
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
