process.env.DB_USER = 'hofokkkh';
process.env.DB_HOST = 'floppy.db.elephantsql.com'
process.env.DB_NAME = 'hofokkkh'
process.env.DB_PASSWORD = '8bJ65b10ITDccn1vtc4TXcdKfRWvCtVE'

// Assuming dotenv is used for environment variables
require('dotenv').config();

const { fetchCategories, postCategory, fetchUsers, postUser, postTodosWithRelation, fetchTodosWithRelation } = require('../lib/api');

describe('API Integration Tests', () => {
    let newUserId, newCategoryId;

    // Cleanup created entities
    afterAll(async () => {
        if (newUserId) await deleteUser(newUserId);
        if (newCategoryId) await deleteCategory(newCategoryId);
        // Implement deleteUser and deleteCategory functions based on your API capabilities
    });

    describe('User Operations', () => {
        it('fetches users successfully', async () => {
            const users = await fetchUsers();
            expect(Array.isArray(users)).toBeTruthy();
            users.forEach(user => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('name');
            });
        });

        it('inserts a new user successfully', async () => {
            const name = 'Test User ' + Date.now();
            user_id = await postUser(name);
            const users = await fetchUsers();
            const newUser = users.find(user => user.name === name);
            expect(newUser).toBeDefined();
            expect(newUser.name).toEqual(name);
            newUserId = newUser.id; // Assuming postUser returns the ID of the new user
        });
    });

    describe('Category Operations', () => {
        it('fetches categories successfully', async () => {
            const categories = await fetchCategories();
            expect(Array.isArray(categories)).toBeTruthy();
            categories.forEach(category => {
                expect(category).toHaveProperty('id');
                expect(category).toHaveProperty('title');
            });
        });

        it('inserts a new category successfully', async () => {
            const title = 'Test Category ' + Date.now();
            category_id = await postCategory(title);
            const categories = await fetchCategories();
            const newCategory = categories.find(category => category.title === title);
            expect(newCategory).toBeDefined();
            expect(newCategory.title).toEqual(title);
            newCategoryId = newCategory.id; // Assuming postCategory returns the ID of the new category
        });
    });

    describe('Todo Operations with Relations', () => {
        it('inserts a new todo with relation successfully', async () => {
            const title = 'Test Todo ' + Date.now();
            const user = { name: "user1" };
            const user_id = await postUser(user.name);
            const category = { title: "category1" };
            const category_id = await postCategory(category.title);
            await postTodosWithRelation(title, user_id, category_id);
            const todos = await fetchTodosWithRelation();
            const newTodo = todos.find(todo => todo.todo_title === title);
            expect(newTodo).toBeDefined();
            expect(newTodo.todo_title).toEqual(title);
            expect(newTodo.category_title).toEqual(category.title);
            expect(newTodo.user_name).toEqual(user.name);
        });
    });

    // Implement helper functions for cleanup
    async function deleteUser(userId) {
        // Your logic to delete a user
    }

    async function deleteCategory(categoryId) {
        // Your logic to delete a category
    }
});
