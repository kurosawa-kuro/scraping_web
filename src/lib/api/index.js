const dbPool = require('../database'); // Ensure the path is correct
require('dotenv').config();

async function fetchUsers() {
    try {
        const query = 'SELECT * FROM users';
        const result = await dbPool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return []; // Return an empty array on error
    }
}

async function postUser(name) {
    try {
        const insertQuery = 'INSERT INTO users (name) VALUES ($1) RETURNING id';
        const result = await dbPool.query(insertQuery, [name]);
        return result.rows[0].id;
    } catch (error) {
        console.error('Failed to post new category:', error);
        throw error; // Rethrow the error after logging
    }
}

async function fetchTodos() {
    try {
        const query = 'SELECT * FROM todos';
        const result = await dbPool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Failed to fetch todos:', error);
        return []; // Return an empty array on error
    }
}

async function fetchTodosWithRelation() {
    try {
        const query = `
            SELECT 
                u.name AS user_name, 
                t.title AS todo_title, 
                c.title AS category_title, 
                t.created_at AS todo_created_at
            FROM 
                users u
            JOIN 
                todos t ON u.id = t.user_id
            JOIN 
                todo_categories tc ON t.id = tc.todo_id
            JOIN 
                categories c ON tc.category_id = c.id
            ORDER BY 
                u.name, t.title, c.title
        `;
        const result = await dbPool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Failed to fetch todos with relation:', error);
        return []; // Return an empty array on error
    }
}

async function postTodosWithRelation(title, user_id, category_id) {
    const client = await dbPool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        // Insert into the todos table and get the id of the inserted row
        const todoInsertQuery = 'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING id';
        const todoRes = await client.query(todoInsertQuery, [title, user_id]);
        const todoId = todoRes.rows[0].id;

        // Insert into the todo_categories table using the new todo id
        const categoryInsertQuery = 'INSERT INTO todo_categories (todo_id, category_id) VALUES ($1, $2)';
        await client.query(categoryInsertQuery, [todoId, category_id]);

        await client.query('COMMIT'); // Commit the transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Roll back the transaction on error
        console.error('Failed to post new todo:', error);
        throw error; // Rethrow the error after logging
    } finally {
        client.release(); // Release the client back to the pool
    }
}

async function fetchCategories() {
    try {
        const query = 'SELECT * FROM categories ORDER BY title';
        const result = await dbPool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return []; // Return an empty array on error
    }
}

async function postCategory(title) {
    try {
        const insertQuery = 'INSERT INTO categories (title) VALUES ($1) RETURNING id';
        const result = await dbPool.query(insertQuery, [title]);
        return result.rows[0].id;
    } catch (error) {
        console.error('Failed to post new category:', error);
        throw error; // Rethrow the error after logging
    }
}

module.exports = { fetchTodos, fetchTodosWithRelation, fetchCategories, postCategory, fetchUsers, postUser, postTodosWithRelation };
