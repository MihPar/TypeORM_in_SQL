const writeSql = async (sql: string) => {
	const fs = require('node:fs/promises');
	  try {
		await fs.writeFile('sql.text', sql);
	  } catch (err) {
		console.log(err);
	  }
}