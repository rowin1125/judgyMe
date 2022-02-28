/* eslint-disable no-console */
import { Prisma } from '@prisma/client';

export const handlePrismaOrm = async callback => {
  try {
    const res = await callback();
    return res;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email'
        );
      }
    }
    throw e;
  }
};
