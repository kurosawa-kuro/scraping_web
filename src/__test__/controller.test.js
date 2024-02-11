const request = require('supertest');
const { app } = require('../app'); // Ensure this path is correct
const dbPool = require('../lib/database'); // Corrected path

const testUserName = 'Test User';
const testCategoryTitle = 'Test Title';

async function insertTestData() {
    await dbPool.query('INSERT INTO users (name) VALUES ($1)', [testUserName]);
}

async function cleanUpTestData() {
    await dbPool.query('DELETE FROM users WHERE name = $1', [testUserName]);
    await dbPool.query('DELETE FROM categories WHERE title = $1', [testCategoryTitle]);
}

describe('GET /users', () => {
    beforeAll(insertTestData);
    afterAll(cleanUpTestData);

    it('responds with the users page, including the test user', async () => {
        const response = await request(app).get('/users');

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain(testUserName);
    });
});

describe('POST /categories', () => {
    beforeEach(() => cleanUpTestData()); // Using the centralized cleanup function
    afterEach(() => cleanUpTestData());

    it('should create a new category and redirect', async () => {
        const response = await request(app)
            .post('/categories')
            .send({ title: testCategoryTitle });

        expect(response.statusCode).toBe(302); // Check for redirection

        const result = await dbPool.query('SELECT * FROM categories WHERE title = $1', [testCategoryTitle]);
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].title).toBe(testCategoryTitle);
    });
});
