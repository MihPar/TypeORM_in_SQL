import { Injectable } from "@nestjs/common";
import { AxiosInstance } from "axios";
const axios = require('axios')

@Injectable()
export class TelegramAdapter {
	
	token = process.env.TOKEN_TELEGRAM
	private axiosInstanse: AxiosInstance
	constructor() {
		// console.log(process.env.TOKEN_TELEGRAM)
		this.axiosInstanse = axios.create({
			baseURL: `https://api.telegram.org/bot${this.token}/`
		})
	}

	async sendMessage(text: string, recipiendId: number) {
		await this.axiosInstanse.post(`sendMessage`, {text, chat_id: recipiendId})
	}

	async setWebhook (url: string) {
		// console.log("setWebhook")
		// const link = await this.axiosInstanse.get(`getUpdates`)
		// console.log(link, " link")
		await this.axiosInstanse.post(`setWebhook`, {url})
	}

	async getLink() {
		const result = await this.axiosInstanse.post("setWebhook")
		console.log("result: ", result.config.baseURL)
		return result.config
	}

}