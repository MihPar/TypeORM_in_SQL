export type BlogsViewType = {
	id: string,
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
  };

  export type BlogsViewWithBanType = {
	id: string,
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
	blogOwnerInfo: {
        userId: string
        userLogin: string
      },
    //   banInfo: {
    //     isBanned: boolean
    //     banDate: string
    //   },
  };

  export type BlogsViewTypeWithUserId = {
	id: string,
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
	userId: string
  };