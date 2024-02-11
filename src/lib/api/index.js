const dbPool = require('../database'); // Ensure the path is correct
require('dotenv').config();

async function fetchUsers() {
    try {
        const query = 'SELECT * FROM todos';
        const result = await dbPool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Failed to fetch todos:', error);
        return []; // Return an empty array on error
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
        const insertQuery = 'INSERT INTO categories (title) VALUES ($1)';
        await dbPool.query(insertQuery, [title]);
    } catch (error) {
        console.error('Failed to post new category:', error);
        throw error; // Rethrow the error after logging
    }
}

module.exports = { fetchTodos, fetchTodosWithRelation, fetchCategories, postCategory };
