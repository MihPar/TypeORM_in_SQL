import { User } from 'src/api/users/entities/user.entity';
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UsersQueryRepository } from "../../../api/users/users.queryRepository";
import { Request } from "express";
import { ApiConfigService } from "../../../infrastructura/config/configService";
import { ApiJwtService } from 'src/infrastructura/jwt/jwt.service';
export class GetUserIdByTokenCommand {
	constructor(
		public req: Request
	) {}
}

@CommandHandler(GetUserIdByTokenCommand)
export class GetUserIdByTokenUseCase implements ICommandHandler<GetUserIdByTokenCommand> {
	constructor(
		protected readonly jwtService: JwtService,
		protected readonly usersQueryRepository:  UsersQueryRepository,
		protected readonly apiConfigService: ApiConfigService,
		protected readonly apiJwtService: ApiJwtService
	) {}
	async execute(command: GetUserIdByTokenCommand): Promise<User> {
	const token: string = command.req.headers.authorization!.split(" ")[1];
	// const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET!});
	const payload = await this.apiJwtService.refreshToken(token);
	if (!payload) throw new UnauthorizedException('Not authorization 401')
	const currentUser: User | null = await this.usersQueryRepository.findUserById(payload.userId)
	if (!currentUser) throw new UnauthorizedException('Not authorization 401')
	return currentUser
	}
}