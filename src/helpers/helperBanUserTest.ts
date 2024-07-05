import { BanUserForBlogInputModel } from "../blogger/dto-class";
import request from 'supertest';
import { PaginationType } from "../types/pagination.types";
import { UserBanBloggerViewType } from "../users/user.type";

export const banUserSpecifyBlog = async (
	server: any, 
	id: string, 
	banUserForBlogDto: BanUserForBlogInputModel, 
	token: string
): Promise<void> => {
	const banUser = await request(server)
		.put(`/blogger/users/${id}/ban`)
		.set('Authorization', `Bearer ${token}`)
		.send(banUserForBlogDto)

		return banUser.body
}

export const getAllBanUsers = async (server: any, blogId: string, token: string) => {
	const getAllBanUsers = await request(server)
		.get(`/blogger/users/blog/${blogId}`)
		.set('Authorization', `Bearer ${token}`)

		// console.log((getAllBanUsers.body as PaginationType<UserBanBloggerViewType | null>).items.map(item => item.banInfo))
		console.log("getAllBanUsers.body: ", getAllBanUsers.body)
		return getAllBanUsers.body
	}