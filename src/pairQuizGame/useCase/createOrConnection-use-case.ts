import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateOrConnectGameCommand {
	constructor(
		public userId: string
	) {}
}

@CommandHandler(CreateOrConnectGameCommand)
export class CreateOrConnectGameUseCase implements ICommandHandler<CreateOrConnectGameCommand> {
	constructor() {}
	async execute(command: CreateOrConnectGameCommand) {}
}