import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { CurrentUser, CurrentUserId, Public } from 'src/shared/decorators';
import { RtGuard } from 'src/shared/guards';
import { AuthType } from './auth';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation('localSignup')
  localSignup(
    @Args('userCreateInput') userCreateInput: UserCreateInput,
  ): Promise<AuthType.Token> {
    return this.authService.localSignup(userCreateInput);
  }

  @Public()
  @Mutation('localSignin')
  localSignin(
    @Args('signinInput')
    signinInput: Extract<UserCreateInput, 'email' | 'hash'>,
  ): Promise<AuthType.Token> {
    return this.authService.localSignin(signinInput);
  }

  @Mutation('logout')
  logout(@CurrentUserId() userId: number) {
    console.log('userId', userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Mutation('refreshToken')
  refreshToken(
    @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUserId() userId: number,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Public()
  @Query('users')
  users() {
    return this.authService.users();
  }
}
