import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { INestApplication } from "@nestjs/common";
import { SecurityDevicesModule } from "../../src/security-devices/security-devices.module";
import { AuthModule } from "../../src/auth/auth.module";
import { UsersModule } from "../../src/users/users.module";
import { DatabaseConfig } from '../../src/infrastructura/config/db.config';
let app: INestApplication;

export const getAppAndCleanDB = async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [
			TypeOrmModule.forRootAsync({
				useFactory(
					config: ConfigService<DatabaseConfig>,
					) {
					return config.get('database', {
						infer: true
					})
				},
				inject: [
					ConfigService,
				]
			}),
			SecurityDevicesModule,
			AuthModule,
			TestingModule,
			UsersModule,
		  ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
	// const dateSource = await app.resolve(DataSource)
	// await dateSource.query(`
	// 	CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
	// 	DECLARE
	// 		statements CURSOR FOR
	// 			SELECT tablename FROM pg_tables
	// 			WHERE tableowner = username AND schemaname = 'public';
	// 	BEGIN
	// 		FOR stmt IN statements LOOP
	// 			EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
	// 		END LOOP;
	// 	END;
	// 	$$ LANGUAGE plpgsql
	// 	SELECT truncate_tables('MYUSER')
	// `)
	return app
  }