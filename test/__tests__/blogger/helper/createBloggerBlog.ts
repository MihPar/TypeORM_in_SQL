import request from 'supertest';
import { BlogsViewType } from "../../../../src/blogs/blogs.type";
import { BodyBlogsModel } from "../../../../src/blogsForSA/dto/blogs.class-pipe";

export const createBlogBlogger = async (server: any, requestBodyAuthLogin: BodyBlogsModel, token: string): Promise<[number, BlogsViewType]> => {
	const createBloByBlogger = await request(server).post('/blogger/blogs').send(requestBodyAuthLogin).set('Authorization', `Bearer ${token}`);
	return [createBloByBlogger.status, createBloByBlogger.body]
}