import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../../api/users/users.queryRepository";
import { Request } from "express";
import { ApiJwtService } from "../../../infrastructura/jwt/jwt.service";
import { User } from "../../users/entities/user.entity";
export class GetUserIdByTokenCommand {
	constructor(
		public req: Request
	) {}
}

@CommandHandler(GetUserIdByTokenCommand)
export class GetUserIdByTokenUseCase implements ICommandHandler<GetUserIdByTokenCommand> {
	constructor(
		protected readonly usersQueryRepository:  UsersQueryRepository,
		protected readonly apiJwtService: ApiJwtService,
		protected readonly jwtService: JwtService
	) {}
	async execute(command: GetUserIdByTokenCommand): Promise<User> {
	const token: string = command.req.headers.authorization!.split(" ")[1];
	const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!});
	// const payload = await this.apiJwtService.refreshToken(token);
	console.log("payload: ", payload)
	if (!payload) throw new UnauthorizedException('Not authorization 401')
	const currentUser: User | null = await this.usersQueryRepository.findUserById(payload.userId)
	if (!currentUser) throw new UnauthorizedException('Not authorization 401')
	return currentUser
	}
}