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

	async sendMessage(text: string, id: string) {
		try {
			await this.axiosInstanse.post(`sendMessage`, {text, chat_id: +id})
		} catch(error) {
			console.log('error: ', error)
		}
		
	}

	async setWebhook (url: string) {
		await this.axiosInstanse.post(`setWebhook`, {url})
	}

	async getLink() {
		const result = await this.axiosInstanse.post("setWebhook")
		console.log("result: ", result.config.baseURL)
		return result.config
	}

}