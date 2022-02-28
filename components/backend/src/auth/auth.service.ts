import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon2 from 'argon2';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthType } from './auth';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async localSignup(userCreateInput: UserCreateInput): Promise<AuthType.Token> {
    const hash = await argon2.hash(userCreateInput.hash);
    let newUser: User;

    try {
      newUser = await this.prisma.user.create({
        data: {
          ...userCreateInput,
          hash,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Duplicate User');
        }
      }
    }

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async localSignin(
    siginCredentials: Pick<UserCreateInput, 'email' | 'hash'>
  ): Promise<AuthType.Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: siginCredentials.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon2.verify(
      user.hash,
      siginCredentials.hash
    );
    if (!passwordMatches) throw new ForbiddenException('Wrong credentials');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          },
        },
        data: {
          hashedRt: null,
        },
      });
    } catch (error) {
      // TODO: Replace me with a Nestjs error
      throw new Error('failed logout');
    }
    return true;
  }

  async updateRtHash(userId: number, rt: string) {
    const hashedRt = await argon2.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt,
      },
    });
  }

  async refreshToken(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new ForbiddenException('Access Denied');
    if (!user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon2.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Wrong credentials');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  users() {
    return this.prisma.user.findMany({
      select: {
        email: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getTokens(userId: number, email: string): Promise<AuthType.Token> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        }
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
