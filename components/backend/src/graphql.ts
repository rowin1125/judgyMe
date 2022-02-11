
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class UserCreateInput {
    email: string;
    hash: string;
    hashedRt?: Nullable<string>;
}

export class SigninInput {
    email: string;
    hash?: Nullable<string>;
}

export class User {
    id: number;
    email: string;
    hash?: Nullable<string>;
    hashedRt?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class TokenResponse {
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
}

export abstract class IMutation {
    abstract localSignup(userCreateInput?: Nullable<UserCreateInput>): Nullable<TokenResponse> | Promise<Nullable<TokenResponse>>;

    abstract localSignin(signinInput?: Nullable<SigninInput>): Nullable<TokenResponse> | Promise<Nullable<TokenResponse>>;

    abstract logout(): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract refreshToken(): Nullable<TokenResponse> | Promise<Nullable<TokenResponse>>;
}

export abstract class IQuery {
    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
