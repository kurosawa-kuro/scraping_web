// src/controller/index.js

const { fetchTodosWithRelation, fetchCategories, postCategory } = require('../model/'); // Adjust the path as necessary

const logError = (error, operation) => {
    console.error(`Error during ${operation}:`, error);
};

const sendServerError = (res) => {
    res.status(500).send('Server error');
};

module.exports = (app) => {
    // Display categories list
    app.get('/categories', async (req, res) => {
        try {
            const categories = await fetchCategories();
            res.render('categories/index', { categories });
        } catch (error) {
            logError(error, 'handling categories request');
            sendServerError(res);
        }
    });

    // Display page for adding a new category
    app.get('/categories/new', (req, res) => {
        res.render('categories/new');
    });

    // Handle POST request to add a new category to the database
    app.post('/categories', async (req, res) => {
        try {
            const { title } = req.body;
            await postCategory(title);
            res.redirect('/categories');
        } catch (error) {
            logError(error, 'adding new category');
            sendServerError(res);
        }
    });

    // Handle root request
    app.get('/', async (req, res) => {
        try {
            const todos = await fetchTodosWithRelation();
            res.render('index', { todos });
        } catch (error) {
            logError(error, 'handling root request');
            sendServerError(res);
        }
    });
};