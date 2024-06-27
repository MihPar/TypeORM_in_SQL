import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { add } from 'date-fns';
import { UsersQueryRepository } from './users.queryRepository';
import { User } from './entities/user.entity';
import { Blogs } from '../blogs/entity/blogs.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BanInputModel } from './user.class';
import { UserBanViewType, UserViewType } from './user.type';
import { PostsRepository } from '../posts/posts.repository';
import { strict } from 'assert';

@Injectable()
export class UsersRepository {

	constructor(
		@InjectRepository(User) protected readonly userRepository: Repository<User>,
		protected readonly usersQueryRepository: UsersQueryRepository,
		@InjectEntityManager()
		private readonly entityManager: EntityManager,
		@InjectDataSource() protected dataSource: DataSource,
		@InjectRepository(Blogs) protected readonly blogsRepository: Repository<Blogs>,
	) { }

	async passwordRecovery(id: any, recoveryCode: string): Promise<boolean> {
		const recoveryInfo = {
			recoveryCode,
			expirationDate: add(new Date(), { minutes: 5 }),
		};

		const recoveryPassword = await this.userRepository
			.createQueryBuilder()
			.update(User)
			.set({
				expirationDate: recoveryInfo.expirationDate,
				confirmationCode: recoveryInfo.recoveryCode
			})
			.where("id = :id", { id })
			.execute()

		if (!recoveryPassword) return false;
		return true;
	}

	async updatePassword(id: any, newPasswordHash: string): Promise<boolean> {
		const updatePassword = await this.userRepository
			.createQueryBuilder()
			.update(User)
			.set({ passwordHash: newPasswordHash })
			.where("id = :id", { id })
			.execute()

		if (!updatePassword) return false;
		return true;
	}

	async updateConfirmation(id: string) {
		const result = await this.userRepository
			.createQueryBuilder()
			.update(User)
			.set({ isConfirmed: true })
			.where("id = :id", { id })
			.execute()

		return true;
	}

	async createUser(newUser: User): Promise<User> {
		const userCreatingResult = await this.userRepository.save(newUser)
		return userCreatingResult
			// .createQueryBuilder()
		// 	.insert()
		// 	.into(User)
		// 	.values([
		// 		{
		// 			login: newUser.login,
		// 			email: newUser.email,
		// 			passwordHash: newUser.passwordHash,
		// 			createdAt: newUser.createdAt,
		// 			confirmationCode: newUser.confirmationCode,
		// 			expirationDate: newUser.expirationDate,
		// 			isConfirmed: newUser.isConfirmed,
		// 			isBanned: newUser.isBanned,
		// 			banReason: newUser.banReason,
		// 			banDate: newUser.banDate,
		// 			banStatus: newUser.banStatus
		// 		}
		// 	])
		// 	.execute()
		// 	.catch(e => console.error("error upon creating user", e))

		// console.log(userCreatingResult, "id")
		// const user = await this.userRepository
		// 	.createQueryBuilder()
		// 	.select()
		// 	.where("id = :id", {id: newUser.id})
		// 	.getOne()
		// return user
	}

	async updateUserConfirmation(
		id: string,
		confirmationCode: string,
		newExpirationDate: Date
	): Promise<boolean> {

		const updateCunfirmation = await this.userRepository
			.createQueryBuilder()
			.update(User)
			.set({
				expirationDate: newExpirationDate,
				confirmationCode: confirmationCode
			})
			.where("id = :id", { id })
			.execute()

		if (!updateCunfirmation) return false;
		return true;
	}

	async deleteById(userId: string): Promise<boolean> {
		const findUserById: User | null = await this.userRepository
			.createQueryBuilder("user")
			.select(["user"])
			.where("user.id = :id", { id: userId })
			.getOne()

		if (!findUserById) return false

		const deleteById = await this.userRepository
			.createQueryBuilder("user")
			.delete()
			.from(User)
			.where("id = :id", { id: userId })
			.execute()
		if (!deleteById) return false;
		return true;
	}

	async deleteAllUsers() {
		await this.userRepository
			.createQueryBuilder()
			.delete()
			.execute()
		return true;
	}

	async findBlogByIdAndUserId(id: string, userId: string): Promise<Blogs> {
		const findBlog = await this.blogsRepository.findOne({
			relations: { user: true },
			where: [{ id }, { userId }]
		})
		if (!findBlog) {
			throw new NotFoundException([
				{ message: 'Blog by id and userId not found' }
			])
		}
		return findBlog
	}

	async banUser(id: string, banInputInfo: BanInputModel): Promise<boolean> {
		const {isBanned, banReason} = banInputInfo
		const banUser = await this.userRepository
			.createQueryBuilder()
			.update(User)
			.set({ 
				isBanned, 
				banDate: isBanned ? new Date().toISOString() : null, 
				banReason: isBanned ? banInputInfo.banReason : null})
			.where({id})
			.execute()

		
		if(!banUser) throw new Error('Ban user is not update in user repository')
		
		
		return (
			banUser.affected !== null &&
			banUser.affected !== undefined &&
			banUser.affected > 0
		  );
	}

}
