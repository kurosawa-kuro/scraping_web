process.env.DB_USER = 'hofokkkh';
process.env.DB_HOST = 'floppy.db.elephantsql.com'
process.env.DB_NAME = 'hofokkkh'
process.env.DB_PASSWORD = '8bJ65b10ITDccn1vtc4TXcdKfRWvCtVE'

const { fetchCategories, postCategory, fetchUsers, postUser, postTodosWithRelation, fetchTodosWithRelation } = require('../lib/api'); // Adjust the path to your actual file

describe('fetchUsers', () => {
    it('fetches users successfully', async () => {
        // Act
        const users = await fetchUsers();

        // Assert
        expect(Array.isArray(users)).toBeTruthy();
        users.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
        });
    });
});

describe('postUser', () => {
    let newUserId = null;

    it('inserts a new user successfully', async () => {
        // Arrange
        const name = 'Test User ' + Date.now(); // Unique name to ensure no collision

        // Act
        await postUser(name);

        // Assert
        const users = await fetchUsers();
        const newUser = users.find(user => user.name === name);
        expect(newUser).toBeDefined();
        expect(newUser.name).toEqual(name);

        // Keep track of the new user's ID for cleanup
        newUserId = newUser.id;
    });
});


describe('fetchCategories', () => {
    it('fetches categories successfully', async () => {
        // Act
        const categories = await fetchCategories();

        // Assert
        expect(Array.isArray(categories)).toBeTruthy();
        // You can also check for the length if you know how many categories there should be:
        // expect(categories).toHaveLength(expectedNumberOfCategories);
        // Or check for specific properties:
        categories.forEach(category => {
            expect(category).toHaveProperty('id');
            expect(category).toHaveProperty('title');
        });
    });
});

describe('postCategory', () => {
    let newCategoryId = null;

    it('inserts a new category successfully', async () => {
        // Arrange
        const title = 'Test Category ' + Date.now(); // Unique title to ensure no collision

        // Act
        await postCategory(title);

        // Assert
        const categories = await fetchCategories();
        const newCategory = categories.find(category => category.title === title);
        expect(newCategory).toBeDefined();
        expect(newCategory.title).toEqual(title);

        // Keep track of the new category's ID for cleanup
        newCategoryId = newCategory.id;
    });
});


describe('postTodosWithRelation', () => {
    it('inserts a new todo with relation successfully', async () => {
        // Arrange

        const title = 'Test Todo ' + Date.now(); // Unique title to ensure no collision

        const user = {
            name: "user1"
        }
        const user_id = await postUser(user.name);

        const category = {
            title: "category1"
        }
        const category_id = await postCategory(category.title);

        // Unique name to ensure no collision
        // Act
        await postTodosWithRelation(title, user_id, category_id);

        // Assert
        const todos = await fetchTodosWithRelation();

        const newTodo = todos.find(todo => todo.todo_title === title);
        expect(newTodo).toBeDefined();
        expect(newTodo.todo_title).toEqual(title);
        expect(newTodo.category_title).toEqual(category.title);
        expect(newTodo.user_name).toEqual(user.name);
    });
});