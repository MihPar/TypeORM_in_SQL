import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { configApp } from '../config/config.app';
let app: INestApplication;

// export const getAppAndCleanDB = async () => {
// 	const moduleFixture: TestingModule = await Test.createTestingModule({
// 		imports: [
// 			TypeOrmModule.forRootAsync({
// 				useFactory(
// 					config: ConfigService<DatabaseConfig>,
// 					) {
// 					return config.get('database', {
// 						infer: true
// 					})
// 				},
// 				inject: [
// 					ConfigService,
// 				]
// 			}),
// 			SecurityDevicesModule,
// 			AuthModule,
// 			TestingModule,
// 			UsersModule,
// 		  ],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();

async function truncateDBTables (
	app: INestApplication, 
	dbOwnerUserName: string,
) {
	const dateSource = await app.resolve(DataSource)
	await dateSource.query(`
		CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
		DECLARE
			statements CURSOR FOR
				SELECT tablename FROM pg_tables
				WHERE tableowner = username AND schemaname = 'public';
		BEGIN
			FOR stmt IN statements LOOP
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
			END LOOP;
		END;
		$$ LANGUAGE plpgsql
		SELECT truncate_tables('${dbOwnerUserName}')
	`)
}

export const getAppForE2ETesting = async () => {
	const appModule: TestingModule = await Test.createTestingModule({
	imports: [AppModule],
	}).compile();

	const app = appModule.createNestApplication()
	configApp (app); // todo: , {swagger: false} await app.initO;
	await app.init()
	await truncateDBTables (app, 'nodejs')
	return app;
	};