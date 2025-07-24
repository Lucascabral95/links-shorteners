import { IsBoolean, IsDate, IsOptional, IsString, Validate, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@ValidatorConstraint({ name: 'secureUrl', async: false })
export class ValidatorUrl implements ValidatorConstraintInterface {
    private readonly domainsBlocked = [
        'localhost', '127.0.0.1', '0.0.0.0', '::1',
        'bit.ly', 'tinyurl.com', 'short.link', 't.co'
    ];

    validate(url: string): boolean {
        if (url.length > 2048) {
            return false;
        }

        let parsedUrl: URL;

        try {
            parsedUrl = new URL(url);
        } catch (error) {
            return false;
        }

        if (parsedUrl.protocol !== 'https:') {
            return false;
        }

        const hostname = parsedUrl.hostname.toLowerCase();

        if (this.domainsBlocked.includes(hostname)) {
            return false;
        }

        if (!hostname.includes('.') || hostname.length < 4) {
            return false;
        }

        if (this.isPrivateIP(hostname)) {
            return false;
        }

        return true;
    }

    private isPrivateIP(hostname: string): boolean {
        const privatePatterns = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[01])\./,
            /^192\.168\./,
            /^127\./,
            /^169\.254\./,
            /^0\./
        ];

        return privatePatterns.some(pattern => pattern.test(hostname));
    }

    defaultMessage(): string {
        return 'Invalid URL. URL must be a valid URL, must be https and not blocked or private IP, not exceed 2048 characters and not be a IP. Example: https://www.google.com. Example of blocked URL: http://localhost';
    }
}

export class CreateLinkDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    @Validate(ValidatorUrl)
    originalUrl: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    shortCode: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    customAlias?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password?: string;

    @ApiProperty()
    @IsDate()
    @IsOptional()
    expiresAt?: Date;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    category?: string;
}
