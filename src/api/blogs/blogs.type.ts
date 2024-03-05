export type BlogsViewType = {
	id: number,
	name: string
	description: string
	websiteUrl: string
	createdAt: string
	isMembership: boolean
  };

  export type BlogsViewTypeWithUserId = {
	id: string,
	name: string
	description: string
	websiteUrl: string
	createdAt: string
	isMembership: boolean
	userId: string
  };