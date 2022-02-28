import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  localSignin?: Maybe<TokenResponse>;
  localSignup?: Maybe<TokenResponse>;
  logout?: Maybe<Scalars['Boolean']>;
  refreshToken?: Maybe<TokenResponse>;
};


export type MutationLocalSigninArgs = {
  signinInput?: InputMaybe<SigninInput>;
};


export type MutationLocalSignupArgs = {
  userCreateInput?: InputMaybe<UserCreateInput>;
};

export type Query = {
  __typename?: 'Query';
  users: Array<Maybe<User>>;
};

export type SigninInput = {
  email: Scalars['String'];
  hash?: InputMaybe<Scalars['String']>;
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  access_token?: Maybe<Scalars['String']>;
  refresh_token?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id: Scalars['Int'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UserCreateInput = {
  email: Scalars['String'];
  hash: Scalars['String'];
  hashedRt?: InputMaybe<Scalars['String']>;
};

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, email: string, createdAt?: any | null, updatedAt?: any | null } | null> };


export const UsersDocument = gql`
    query Users {
  users {
    id
    email
    createdAt
    updatedAt
  }
}
    `;

export function useUsersQuery(options?: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'>) {
  return Urql.useQuery<UsersQuery>({ query: UsersDocument, ...options });
};