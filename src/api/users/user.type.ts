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
   id: number;
   login: string;
   email: string;
   createdAt: Date;
 }