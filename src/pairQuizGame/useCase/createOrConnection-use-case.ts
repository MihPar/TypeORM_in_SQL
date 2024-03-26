import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionTypeModel } from "../type/typeViewModel";

export class CreateOrConnectGameCommand {
	constructor(
		public userId: string
	) {}
}

@CommandHandler(CreateOrConnectGameCommand)
export class CreateOrConnectGameUseCase implements ICommandHandler<CreateOrConnectGameCommand> {
	constructor() {}
	async execute(command: CreateOrConnectGameCommand): Promise<QuestionTypeModel> {
		
		return 
	}
}