import request from 'supertest';


export const getAllBlogs = async (server: any) => {
	const getBlogs = await request(server).get('/blogs').query({
		searchNameTerm: "",
		sortBy: "createdAt",
		sortDirection: 'desc' || 'asc',
		pageNumber: '1',
		pageSize: '10'
	})
	return getBlogs.body
}

export const getBlogById = async (server: any, id: string, token: string) => {
	const getBlogById = await request(server).get(`/blogs/${id}`).set('Authorization', `Bearer ${token}`)
	return getBlogById.body
}