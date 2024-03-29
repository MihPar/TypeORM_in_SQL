/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testTimeout: 1000000,
	testRegex: '.e2e.test.ts$'
};

// yarn test:e2e question.e2e.test.ts