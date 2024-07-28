import { Injectable } from "@nestjs/common";
import { AxiosInstance } from "axios";
const axios = require('axios')

@Injectable()
export class TelegramAdapter {
	token = "7458802020:AAH7YP0wUgtr4IrxhZi8qv9Z835CvZ0XN3c"
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