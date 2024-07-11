import {existsSync, mkdirSync, readFile, writeFile} from 'node:fs';
import { join, dirname } from 'node:path';

export const readTextFileAsync = (relativePath: string) => {
	return new Promise((resolve, reject) => {
		const rootDirPath = dirname(require.main.filename)
		const filePath = join(rootDirPath, relativePath)

		readFile(filePath, {
			encoding: 'utf-8'
		}, (error, content) => {
			if(error) {
				console.error(error)
				reject(error)
			}
				resolve(content)
		})
	})
}

export const saveFileAsync = (realivePath: string, data: Buffer) => {
	return new Promise<void>((resolve, reject) =>{
		const rootPath = dirname(require.main.filename)
		const filePath = join(rootPath, realivePath)
		writeFile(filePath, data, (error) => {
			if(error) {
				console.error(error)
				reject(error)
			}
			resolve()
		}
	)
	})
}

export const ensureDirSync = (relativeDir): void => {
	const rootPath = dirname(require.main.filename)
	const dirPath = join(rootPath, relativeDir)
	if(!existsSync(dirPath)) {
		mkdirSync(dirPath, {recursive: true})
	}
}