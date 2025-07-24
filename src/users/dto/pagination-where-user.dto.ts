import { Role } from "generated/prisma";

export interface WhereUserPaginationDto {
    full_name?: {
        contains: string;
        mode: 'insensitive';
    };
    role?: Role;
    verified?: boolean;
    provider?: {
        contains: string;
        mode: 'insensitive';
    };
}
