import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto, PasswordResetRequestDto, PasswordResetConfirmDto, ResponseLoginGoogleDto } from './dto';
import { GoogleOAuthGuard } from './guards/google-guard.guard';
import { envs } from 'src/config/envs';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseRegisterAuthDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { ResponseLoginAuthDto } from './dto/response-login-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user with email and password. Retorned message: User created successfully with user data.'
  })
  @ApiResponse({ status: 201, type: ResponseRegisterAuthDto })
  @ApiResponse({ status: 400, type: 'User already exists' })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  register(@Body() createAuthDto: RegisterAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Login a user with email and password. Retorned message: User logged in successfully with token JWT with user data.'
  })
  @ApiResponse({ status: 201, type: ResponseLoginAuthDto })
  @ApiResponse({ status: 400, type: 'Invalid credentials' })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }

  // Forgot password 
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Forgot password. Retorned message: If an account with that email exists, we\'ve sent for email a password reset link that is valid for 5 minutes.'
  })
  @ApiResponse({ status: 201, type: 'If an account with that email exists, we\'ve sent a password reset link' })
  @ApiResponse({ status: 400, type: 'Could not process password reset' })
  @ApiResponse({ status: 500, type: 'Internal Server Error' })
  resetPassword(@Body() resetPasswordDto: PasswordResetRequestDto) {
    return this.authService.forgotPassword(resetPasswordDto);
  }

  @Post('confirm-password')
  @ApiOperation({
    summary: 'Confirm password',
    description: 'Confirm password. Retorned message: Password reset successfully.'
  })
  @ApiResponse({ status: 201, type: 'Password reset successfully' })
  @ApiResponse({ status: 401, type: 'Invalid or expired token' })
  @ApiResponse({ status: 409, type: 'The token has already been used' })
  @ApiResponse({ status: 410, type: 'The token has expired' })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  confirmPassword(@Body() passwordResetConfirmDto: PasswordResetConfirmDto) {
    return this.authService.confirmPassword(passwordResetConfirmDto);
  }

  // Auth with Google
  @Post('google')
  @ApiOperation({
    summary: 'Auth with Google',
    description: 'Auth with Google. Retorned message: User logged in successfully with token JWT with user data.'
  })
  @ApiResponse({ status: 201, type: ResponseLoginGoogleDto })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  @ApiResponse({ status: 400, type: "No Google user data was received" })
  @UseGuards(GoogleOAuthGuard)
  async googleLogin(@Req() req) {
  }

  @Post('google/callback')
  @ApiOperation({
    summary: 'Auth with Google callback',
    description: 'Auth with Google callback. Retorned message: User logged in successfully with token JWT with user data.'
  })
  @UseGuards(GoogleOAuthGuard)
  @ApiResponse({ status: 201, type: ResponseLoginGoogleDto })
  @ApiResponse({ status: 500, type: "Internal Server Error" })
  @ApiResponse({ status: 400, type: "No Google user data was received" })
  googleCallback(@Req() req, @Res() res) {
    try {
      if (!req.user) {
        throw new BadRequestException('No Google user data was received');
      }

      return res.redirect(envs.loginSessionCallback);
    } catch (error) {
      console.error('Error in googleCallback:', error);

      return res.redirect(envs.loginSessionFailed);
    }
  }
}
