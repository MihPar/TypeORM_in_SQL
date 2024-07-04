import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { add } from 'date-fns';
import { UsersQueryRepository } from './users.queryRepository';
import { User } from './entities/user.entity';
import { Blogs } from '../blogs/entity/blogs.entity';
import { BanInputModel } from './user.class';
import { UserBanBloggerViewType, UserBanViewType } from './user.type';
import { PaginationType } from '../types/pagination.types';

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

	async banUser(id: string, banInputInfo: BanInputModel): Promise<User> {
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

		const result = await this.userRepository.findOne({
			where: {id}
		})
				
			// console.log("user: ", result)

		return result
		// if(!banUser) throw new Error('Ban user is not update in user repository')
		
		
		// return (
		// 	banUser.affected !== null &&
		// 	banUser.affected !== undefined &&
		// 	banUser.affected > 0
		//   );
	}

	async findAllUsers(
		searchLoginTerm: string | null,
		searchEmailTerm: string | null,
		sortBy: string,
		sortDirection: 'asc' | 'desc',
		pageSize: string,
		pageNumber: string,
	  ): Promise<PaginationType<UserBanViewType>> {
		const queryBuilder = this.userRepository
		  .createQueryBuilder('UserTrm')
		  .where(
			`${
			  searchLoginTerm
				? 'UserTrm.login ilike :searchLoginTerm'
				: 'UserTrm.login is not null'
			}`,
			{ searchLoginTerm: `%${searchLoginTerm}%` },
		  )
		  .orWhere(
			`${
			  searchEmailTerm
				? 'UserTrm.email ilike :searchEmailTerm'
				: 'UserTrm.email is not null'
			}`,
			{ searchEmailTerm: `%${searchEmailTerm}%` },
		  )
		  .orderBy(
			'UserTrm.' + sortBy,
			sortDirection.toUpperCase() as 'ASC' | 'DESC',
		  )
		  .take(+pageSize)
		  .skip((+pageNumber - 1) * +pageSize);
	
		const users = await queryBuilder.getMany();
		const totalCountQuery = await queryBuilder.getCount();
	
		const items = users.map(
			(user: User): UserBanViewType => {
				return {
				id: user.id,
				login: user.login,
				email: user.email,
				createdAt: user.createdAt,
				banInfo: {
					isBanned: user.isBanned,
					banDate: user.isBanned ? user.banDate : null,
					banReason: user.isBanned ? user.banReason : null,
				},
				};
		  });
	
		return {
		  pagesCount: Math.ceil(totalCountQuery / +pageSize),
		  page: +pageNumber,
		  pageSize: +pageSize,
		  totalCount: totalCountQuery,
		  items,
		};
	  }

	  async findBannedUsers(
		banStatus: boolean,
		searchLoginTerm: string | null,
		searchEmailTerm: string | null,
		sortBy: string,
		sortDirection: 'asc' | 'desc',
		pageSize: string,
		pageNumber: string,
	  ): Promise<PaginationType<UserBanViewType>> {
		// console.log(banStatus, 'status repo');
	
		const queryBuilder = this.userRepository
		  .createQueryBuilder('UserTrm')
		  .where('UserTrm.isBanned =:status', { status: banStatus })
		  .andWhere(
			`${
			  searchLoginTerm || searchEmailTerm
				? 'UserTrm.login ilike :searchLoginTerm OR UserTrm.email ilike :searchEmailTerm'
				: 'UserTrm.login is not null'
			}`,
			{
			  searchLoginTerm: `%${searchLoginTerm}%`,
			  searchEmailTerm: `%${searchEmailTerm}%`,
			},
		  )
	
		  .orderBy(
			'UserTrm.' + sortBy,
			sortDirection.toUpperCase() as 'ASC' | 'DESC',
		  )
		  .take(+pageSize)
		  .skip((+pageNumber - 1) * +pageSize);
	
		const users = await queryBuilder.getMany();
		const totalCountQuery = await queryBuilder.getCount();
	
		const items = users.map((user: User): UserBanViewType => {
			return {
				id: user.id,
				login: user.login,
				email: user.email,
				createdAt: user.createdAt,
				banInfo: {
					isBanned: user.isBanned,
					banDate: user.isBanned ? user.banDate : null,
					banReason: user.isBanned ? user.banReason : null,
				},
			};
	  });
	
		return {
		  pagesCount: Math.ceil(totalCountQuery / +pageSize),
		  page: +pageNumber,
		  pageSize: +pageSize,
		  totalCount: totalCountQuery,
		  items,
		};
	  }

	  async unbannedUser(id: string, blogId: string): Promise<void> {
		await this.userRepository.delete({id, blogId})
		return
	}

	async findAllBannedUserSpecifyBlogger(
		searchLoginTerm: string, 
		sortBy: string, 
		sortDirection: string, 
		pageSize: number, 
		pageNumber: number, 
		blogId: string
	): Promise<PaginationType<UserBanBloggerViewType | null>> {
		const findBannedUserBlog = await this.blogsRepository.findBy({id: blogId})
		const userIds = findBannedUserBlog.map(item => {return item.userId})
		const query = await this.userRepository
			.createQueryBuilder('u')
			.where(`"u.id" = any(:userIds)`, {userIds: userIds})
			.orderBy(
				'u.' + sortBy,
				sortDirection.toUpperCase() as 'ASC' | 'DESC',
			  )
			  .take(pageSize)
			  .skip((pageNumber - 1) * pageSize);

		const users = await query.getMany()
		const count = await query.getCount();

		const items = await Promise.all(
			users.map(async (item) => {
			const banUser = await this.blogsRepository
				.createQueryBuilder('BannedUsersInBlogsEntityTrm')
				.where('BannedUsersInBlogsEntityTrm.userId = :userId', {
				userId: item.id
				})
				.getOne();
		  return {
			id: item.id,
			login: item.login,
			banInfo: {
			  isBanned: banUser!.isBanned,
			  banDate: banUser!.banDate,
			  banReason: banUser!.banReason,
			},
		  }}))

		  return {
			pagesCount: Math.ceil(count / pageSize),
			page: pageNumber,
			pageSize,
			totalCount: count,
			items,
		  };
	}
}
