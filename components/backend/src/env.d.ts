declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    JWT_TOKEN: string;
    JWT_REFRESH_TOKEN: string;
  }
}
