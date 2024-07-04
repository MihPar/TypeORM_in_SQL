import { BanUserForBlogInputModel } from "../blogger/dto-class";
import request from 'supertest';

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