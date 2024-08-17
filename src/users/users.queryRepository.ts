import "reflect-metadata"
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserBanViewType } from './user.type';
import { PaginationType } from "../types/pagination.types";
import { User } from "./entities/user.entity";
import { Blogs } from "../blogs/entity/blogs.entity";
import { BanStatus } from './enum';

@Injectable()
export class UsersQueryRepository {
	constructor(
		@InjectRepository(User) protected readonly userRepository: Repository<User>,
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
	) { }
	async getAllUsers(
		banStatus: BanStatus,
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string,
		searchLoginTerm: string,
		searchEmailTerm: string
	): Promise<PaginationType<UserBanViewType>> {

		const users = await this.userRepository
			.createQueryBuilder('user')
			.select(['user'])
			.where('user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm', { loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%` })
			.orderBy(`"user"."${sortBy}"`, `${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
			.limit(+pageSize)
			.offset((+pageNumber - 1) * +pageSize)
			.getMany();

		const queryBuilderTotalCount =
			this.userRepository.createQueryBuilder('user');

		const totalCount = await queryBuilderTotalCount
			.where("user.login ILIKE :loginTerm OR user.email ILIKE :emailTerm", { loginTerm: `%${searchLoginTerm}%`, emailTerm: `%${searchEmailTerm}%` })
			.andWhere(`"banStatus" = :banStatus`, {banStatus})
			.getCount();

		const pagesCount = Math.ceil(totalCount / +pageSize);
		return {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: totalCount,
			items: users.map(
				(user: User): UserBanViewType => ({
					id: user.id,
					login: user.login,
					email: user.email,
					createdAt: user.createdAt,
					banInfo: {
						isBanned: user.isBanned,
						banDate: user.banDate,
						banReason: user.banReason
					  }
				})
			),
		};
	}

	async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
		const user: User | null = await this.userRepository
			.createQueryBuilder("user")
			.select("user")
			.where("user.login = :login OR user.email = :email", { login: loginOrEmail, email: loginOrEmail })
			.getOne()

		return user;
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user: User | null = await this.userRepository
			.createQueryBuilder("user")
			.select("user")
			.where("user.email = :email", { email })
			.getOne()
		return user;
	}

	async findUserByLogin(login: string): Promise<User | null> {
		const user: User | null = await this.userRepository
			.createQueryBuilder('user')
			.select("user")
			.where("user.login = :log", { log: login })
			.getOne()
		return user;
	}

	async findUserByCode(
		recoveryCode: string
	): Promise<User | null> {
		const result = await this.userRepository
			.createQueryBuilder("user")
			.select("user")
			.where("user.confirmationCode = :code", { code: recoveryCode })
			.getOne()
		return result
	}

	async findUserByConfirmation(code: string): Promise<User | null> {
		const user: User | null = await this.userRepository
			.createQueryBuilder('user')
			.select("user")
			.where("user.confirmationCode = :code", { code })
			.getOne()

		return user;
	}

	async findUserById(id: string): Promise<User | null> {
		let user: User | null = await this.userRepository
			.createQueryBuilder("user")
			.select("user")
			.where("user.id = :id", { id })
			.getOne()

		if(!user) return null
		// const sqlRequest = user.getSql()
		// await writeSql(sqlRequest)
		return user;
	}

	async findUserAndDevicesById(id: string): Promise<User | null> {
		let user: User | null = await this.userRepository
			.createQueryBuilder("user")
			.select("user")
			.where("user.id = :id", { id })
			.getOne()

		return user;
	}

	async findUserByBlogId(blogId: string) {
		const findUser = await this.userRepository
			.createQueryBuilder()
			.where(`"blogId" = :blogId`, {blogId})
			.getOne()
			if(!findUser) throw new NotFoundException([
				{message: 'User does not found'}
			])
		return findUser
	}
}
