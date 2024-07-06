import request from 'supertest';
import { BanBlogInputModel } from '../../../../src/blogsForSA/dto/blogs.class-pipe';


export const findSABlog = async(server: any) => {
	const findBlog = await request(server).get('/sa/blogs').query({
		searchNameTerm: "",
		sortBy: "createdAt",
		sortDirection: 'desc',
		pageNumber: '1',
		pageSize: '10'
	}).auth('admin', 'qwerty')

	console.log('findBlog', findBlog.body)
	return findBlog.body
}

export const banUnbanBlog = async (server: any, id: string, bodyBan: BanBlogInputModel) => {
	const banUnbanBlog = await request(server).put(`/sa/blogs/${id}/ban`).auth('admin', 'qwerty').send(bodyBan)
	return banUnbanBlog.body
}