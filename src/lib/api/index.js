const dbPool = require('../database'); // Ensure the path is correct
require('dotenv').config();

async function executeQuery(query, params = []) {
    try {
        const result = await dbPool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error(`Failed to execute query: ${query}`, error);
        throw error; // Propagate error to be handled by the caller
    }
}

async function fetchUsers() {
    const query = 'SELECT * FROM users';
    return await executeQuery(query);
}

async function postUser(name) {
    const insertQuery = 'INSERT INTO users (name) VALUES ($1) RETURNING id';
    const users = await executeQuery(insertQuery, [name]);
    return users[0].id;
}

async function fetchTodos() {
    const query = 'SELECT * FROM todos';
    return await executeQuery(query);
}

async function fetchTodosWithRelation() {
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
    return await executeQuery(query);
}

async function postTodosWithRelation(title, user_id, category_id) {
    const client = await dbPool.connect();
    try {
        await client.query('BEGIN');
        const todoInsertQuery = 'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING id';
        const todoRes = await client.query(todoInsertQuery, [title, user_id]);
        const todoId = todoRes.rows[0].id;
        const categoryInsertQuery = 'INSERT INTO todo_categories (todo_id, category_id) VALUES ($1, $2)';
        await client.query(categoryInsertQuery, [todoId, category_id]);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to post new todo with relation:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function fetchCategories() {
    const query = 'SELECT * FROM categories ORDER BY title';
    return await executeQuery(query);
}

async function postCategory(title) {
    const insertQuery = 'INSERT INTO categories (title) VALUES ($1) RETURNING id';
    const categories = await executeQuery(insertQuery, [title]);
    return categories[0].id;
}

module.exports = {
    fetchTodos,
    fetchTodosWithRelation,
    fetchCategories,
    postCategory,
    fetchUsers,
    postUser,
    postTodosWithRelation
};
