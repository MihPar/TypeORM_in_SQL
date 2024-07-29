import { Injectable } from "@nestjs/common";
import { AxiosInstance } from "axios";
const axios = require('axios')

@Injectable()
export class TelegramAdapter {
	token = process.env.TOKEN_TELEGRAM
	private axiosInstanse: AxiosInstance
	constructor() {
		this.axiosInstanse = axios.create({
			baseURL: `https://api.telegram.org/bot${this.token}/`
		})
	}

	async sendMessage(text: string, recipiendId: number) {
		await this.axiosInstanse.post(`sendMessage`, {text: text, chat_id: recipiendId})
	}

	async setWebhook (url: string) {
		await this.axiosInstanse.post(`setWebhook`, {url})
	}

}