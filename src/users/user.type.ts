export type AccountDataType = {
	userName: string
	email: string
	passwordHash: string
	createdAt: string
}

export type EmailConfirmationType = {
   confirmationCode: string
   expirationDate: Date
   isConfirmed: boolean
}	

export type UserViewType = {
   id: string;
   login: string;
   email: string;
   createdAt: Date;
 }

 export type BanInfo = {
        isBanned: boolean
        banDate: string
        banReason: string
 }

export type UserBanViewType = {
	id: string;
	login: string;
	email: string;
	createdAt: Date;
	banInfo: BanInfo
}