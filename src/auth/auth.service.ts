import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto, PayloadJwtDto, PasswordResetRequestDto, PasswordResetConfirmDto, LoginGoogleDto } from './dto';
import { PrismaClient } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { handlePrismaError } from 'src/utils/prisma-error-handler';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

  constructor(private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const emailToLowerCase = registerAuthDto.email.toLowerCase().trim();

    const userExists = await this.user.findUnique({
      where: {
        email: emailToLowerCase
      }
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    try {
      const newUser = await this.user.create({
        data: {
          ...registerAuthDto,
          email: emailToLowerCase,
          password: await bcrypt.hash(registerAuthDto.password, 10),
        },
      });

      const { password, ...userWithoutPassword } = newUser;
      return {
        userCreated: userWithoutPassword,
        message: "User created successfully"
      };
    } catch (error) {
      handlePrismaError(error, 'User');
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { password, ...userWithoutPassword } = loginAuthDto;

    const userExists = await this.user.findUnique({
      where: {
        email: userWithoutPassword.email.toLowerCase().trim()
      }
    });

    if (!userExists) {
      throw new BadRequestException('User not exists');
    }

    if (!userExists.password) {
      throw new BadRequestException('User not exists');
    }

    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: PayloadJwtDto = {
      id: userExists.id,
      email: userExists.email,
      role: userExists.role,
      verified: userExists.verified,
      full_name: userExists.full_name,
      created_at: userExists.created_at
    };

    return {
      userLogged: userWithoutPassword,
      token: this.jwtService.sign(payload),
      message: "User logged in successfully"
    };
  }

  // forgot password
  async forgotPassword(resetPasswordDto: PasswordResetRequestDto) {
    const { email } = resetPasswordDto;

    try {
      const user = await this.user.findUnique({
        where: {
          email: email.toLowerCase().trim()
        }
      });

      if (!user) {
        return {
          message: "If an account with that email exists, we've sent a password reset link"
        };
      }

      await this.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          used: false,
          expiresAt: {
            gt: new Date()
          }
        },
        data: {
          used: true
        }
      });

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await this.passwordResetToken.create({
        data: {
          token: token,
          userId: user.id,
          expiresAt: expiresAt,
          used: false
        }
      });

      this.emailService.sendPasswordResetEmail(user.email, token)
        .catch(error => {
          console.error('Error sending email:', error);
        });

      return {
        message: "If an account with that email exists, we've sent a password reset link"
      };

    } catch (error) {
      console.error('Error in forgotPassword:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Could not process password reset');
    }
  }

  // confirm password reset
  async confirmPassword(passwordResetConfirmDto: PasswordResetConfirmDto) {
    const { token, newPassword } = passwordResetConfirmDto;

    const resetToken = await this.passwordResetToken.findUnique({
      where: {
        token: token
      },
      include: {
        user: true
      }
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('The token has expired');
    }

    if (resetToken.used) {
      throw new BadRequestException('The token has already been used');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.user.update({
      where: {
        id: resetToken.userId
      },
      data: {
        password: hashedPassword
      }
    });

    await this.passwordResetToken.update({
      where: {
        token: token
      },
      data: {
        used: true
      }
    });

    return {
      message: 'Password reset successfully'
    };
  }

  async cleanExpiredTokens() {
    await this.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  // autenticacion con cuenta de google
  async validateOrCreateGoogleUser(googleUser: any) {
    const { email, googleId, full_name, picture } = googleUser;

    let user = await this.user.findFirst({
      where: {
        OR: [
          { email: email },
          { googleId: googleId }
        ]
      }
    });

    if (user) {
      if (!user.googleId) {
        user = await this.user.update({
          where: { id: user.id },
          data: {
            googleId: googleId,
            picture: picture || user.picture,
            full_name: full_name || user.full_name,
          }
        });
      }
    } else {
      user = await this.user.create({
        data: {
          email,
          googleId,
          full_name,
          picture,
          provider: 'google',
        }
      });
    }

    return {
      token: this.generateJwtToken(user as PayloadJwtDto),
      message: "User created successfully",
    };
  }

  generateJwtToken(user: PayloadJwtDto) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }


}
