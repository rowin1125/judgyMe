import { Test } from '@nestjs/testing';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

describe('Auth Service Int', () => {
  let prisma: PrismaService;
  let authService: AuthService;

  const userInput: UserCreateInput = {
    email: 'rowin@test.nl',
    hash: '123456',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);

    await prisma.cleanDatabase();
  });

  describe('localSignUp()', () => {
    it('Should create an user an provide tokens and save the stored hashed values', async () => {
      const tokens = await authService.localSignup(userInput);
      const user = await prisma.user.findUnique({
        where: {
          email: userInput.email,
        },
      });

      expect(await argon2.verify(user.hash, userInput.hash)).toBeTruthy();
      expect(
        await argon2.verify(user.hashedRt, tokens.refresh_token),
      ).toBeTruthy();
    });

    it('should throw an error when saving with the same email', async () => {
      await authService.localSignup(userInput);
      await authService.localSignup(userInput).catch((e) => {
        expect(e.status).toBe(403);
      });
    });
  });

  describe('localSignin()', () => {
    it('When you do a localSignUp you should be logged in and you should be able to logout', async () => {
      await authService.localSignup(userInput);

      const fetchUser = () => {
        return prisma.user.findUnique({
          where: {
            email: userInput.email,
          },
        });
      };

      const user = await fetchUser();

      expect(user.hashedRt).toBeTruthy();
      await authService.logout(user.id);

      const refetchedUser = await await fetchUser();
      expect(refetchedUser.hashedRt).toBeFalsy();
    });
  });
});
