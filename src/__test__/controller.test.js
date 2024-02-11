const request = require('supertest');
const { app } = require('../app'); // Adjust this path to correctly import your Express app
const dbPool = require('..//lib/database'); // Adjust this path to correctly import your dbPool

describe('GET /users', () => {
    beforeAll(async () => {
        // Optionally insert test data into the test database
        await dbPool.query('INSERT INTO users (name) VALUES ($1)', ['Test User']);
    });

    afterAll(async () => {
        // Clean up: delete test data from the test database
        await dbPool.query('DELETE FROM users WHERE name = $1', ['Test User']);
    });

    it('responds with the users page', async () => {
        const response = await request(app).get('/users');

        expect(response.statusCode).toBe(200);
        // Make more specific assertions based on the output of your /users route
        expect(response.text).toContain('Test User');
    });

    // Additional tests as needed
});

describe('POST /categories', () => {
    // Cleanup test data before and after tests to ensure test isolation
    beforeEach(async () => {
        await dbPool.query('DELETE FROM categories WHERE title = $1', ['Test Title']);
    });

    afterEach(async () => {
        await dbPool.query('DELETE FROM categories WHERE title = $1', ['Test Title']);
    });

    it('should create a new category and redirect', async () => {
        const title = 'Test Title';
        const response = await request(app)
            .post('/categories')
            .send({ title });

        // Validate the response and redirection
        expect(response.statusCode).toBe(302); // Assuming redirection happens upon successful creation

        // Verify the record was inserted into the database
        const result = await dbPool.query('SELECT * FROM categories WHERE title = $1', ['Test Title']);
        expect(result.rows.length).toBeGreaterThan(0); // Ensure at least one record was found
        expect(result.rows[0].title).toBe(title);
    });
});
