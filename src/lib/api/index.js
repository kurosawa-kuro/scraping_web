const axios = require('axios');
const cheerio = require('cheerio');
const dbPool = require('../database'); // パスが正しいことを確認
require('dotenv').config();

async function fetchTodos() {

    try {
        const query = 'SELECT * FROM todos';
        const result = await dbPool.query(query);
        return result.rows;
    }
    catch (error) {
        console.error('Failed to scrape manga titles:', error);
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
    }
}


module.exports = { fetchTodos, fetchTodosWithRelation };
