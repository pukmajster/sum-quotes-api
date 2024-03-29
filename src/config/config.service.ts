// https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// require('dotenv').config();
require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  // entities: ['**/*.entity{.ts,.js}'],
  // migrations: ['src/migration/**/*.{ts, js}'],
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DB'),
      
      entities: [this.getValue('TYPEORM_ENTITIES')],
      migrationsTableName: 'migration',
      migrations: [this.getValue('TYPEORM_MIGRATIONS')],

      synchronize: false,
      
      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB'
  ]);

export { configService };