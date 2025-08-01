import { IsString } from "class-validator";

export class VerifyPasswordLinkDto {
    @IsString()
    password: string;
}