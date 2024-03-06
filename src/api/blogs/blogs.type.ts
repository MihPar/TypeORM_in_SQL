export type BlogsViewType = {
	id: string,
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
  };

  export type BlogsViewTypeWithUserId = {
	id: string,
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
	userId: number
  };