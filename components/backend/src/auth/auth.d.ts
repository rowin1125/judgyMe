import { User } from 'src/graphql';

namespace AuthType {
  type Token = {
    access_token: string;
    refresh_token: string;
  };

  type JwtUser = {
    sub: number;
    email: string;
    iat: number;
    exp: number;
  };
}
