export type TelegramUpdateMessage = {
		from: {
			id: number
			first_name: string
			second_name: string
		},
		text: string
}