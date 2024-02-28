import "reflect-metadata"
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserViewType } from './user.type';
import { PaginationType } from "../../types/pagination.types";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersQueryRepository {
  constructor(
	@InjectRepository(User) protected readonly repository: Repository<User>,
	) {}
  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string,
    searchEmailTerm: string
  ): Promise<PaginationType<UserViewType>> {
    if (sortBy === "login") {
		sortBy = "userName";
	  }

	const users = await this.repository
		.createQueryBuilder("u")
		.select("user u")
		.where("u.userName ILIKE :loginTerm", {loginTerm: `%${searchLoginTerm}%`})
		.orWhere("u.userName ILIKE :emailTerm", {emailTerm: `%${searchEmailTerm}%`})
		.orderBy(`${sortBy}`,`${sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"}`)
		.limit(+pageSize)
		.offset((+pageNumber - 1) * +pageSize)
		.getMany()
    
	const totalCount = await this.repository
		.createQueryBuilder("u")
		.select("user u")
		.where("u.userName ILIKE :loginTerm", {loginTerm: `%${searchLoginTerm}%`})
		.orWhere("u.userName ILIKE :emailTerm", {emailTerm: `%${searchEmailTerm}%`})
		.getCount()

    const pagesCount: number = await Math.ceil(totalCount / +pageSize);
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: +totalCount,
      items: users.map(
        (user: User): UserViewType => ({
          id: user.id.toString(),
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
        })
      ),
    };
  }

//   async findByLoginOrEmail(loginOrEmail: string): Promise<UserClass | null> {
//     const user: UserClass | null = (
//       await this.dataSource.query(`
// 		SELECT *
// 			FROM public."Users"
// 			WHERE "userName" = '${loginOrEmail}' OR "email" = '${loginOrEmail}'
// 		`)
//     )[0];
//     return user;
//   }

//   async findUserByEmail(email: string): Promise<UserClass | null> {
//     const user: UserClass | null = (
//       await this.dataSource.query(`
// 			SELECT *
// 				FROM public."Users"
// 				WHERE "email" = '${email}'
// 		`)
//     )[0];
//     return user;
//   }

//   async findUserByLogin(login: string): Promise<UserClass | null> {
//     const user: UserClass | null = (
//       await this.dataSource.query(`
// 			SELECT *
// 				FROM public."Users"
// 				WHERE "userName" = '${login}'
// 		`)
//     )[0];
//     return user;
//   }

//   async findUserByCode(
//     recoveryCode: string
//   ): Promise<WithId<UserClass> | null> {
//     const result = await this.dataSource.query(`
// 		SELECT *
// 			FROM public."Users"
// 			WHERE "confirmationCode" = '${recoveryCode}'
// 		`);
//     return result[0];
//   }

//   async findUserByConfirmation(code: string): Promise<UserClass | null> {
//     const user: UserClass | null = (
//       await this.dataSource.query(`
// 		SELECT *
// 			FROM public."Users"
// 			WHERE "confirmationCode" = $1
// 	`,
//         [code]
//       )
//     )[0];
//     return user;
//   }

  async findUserById(id: string): Promise<User | null> {
    let user: User | null = await this.repository
		.createQueryBuilder("u")
		.select("user")
		.where("u.id = :id", {id})
		.getOne()
      
    return user;
  }
}
