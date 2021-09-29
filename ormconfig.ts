import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const prodConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
    requestCert: true,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],

  synchronize: true,
};

const localConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  database: 'sample_api_db',
  port: 5432,
  username: 'pk',
  password: 'evofox',
  entities: ['dist/**/*.entity{.ts,.js}'],

  synchronize: true,
};
let config: PostgresConnectionOptions;
if (process.env.NODE_ENV === 'production') {
  config = prodConfig;
} else {
  config = localConfig;
}

export { config };
