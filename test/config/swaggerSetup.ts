import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerSetup(app: INestApplication) {
	const config = new DocumentBuilder()
	.setTitle ('')
	.setDescription('')
	.setVersion ('1.0')
	.addTag('')
	.build();
	const document = SwaggerModule.createDocument (app, config);
	SwaggerModule.setup ('api', app, document);
}