// src/controller/index.js

const { fetchTodosWithRelation, fetchCategories, postCategory, fetchUsers, postUser, postTodosWithRelation } = require('../model/'); // Adjust the path as necessary

const logError = (error, operation) => {
    console.error(`Error during ${operation}:`, error);
};

const sendServerError = (res) => {
    res.status(500).send('Server error');
};

module.exports = (app) => {
    app.get('/users', async (req, res) => {
        try {
            const users = await fetchUsers();
            res.render('users/index', { users }); // Pass the users to the view
        } catch (error) {
            logError(error, 'handling users request');
            sendServerError(res);
        }
    });

    // Display page for adding a new category
    app.get('/users/new', (req, res) => {
        res.render('users/new');
    });

    app.post('/users', async (req, res) => {
        try {
            const { name } = req.body;
            console.log("name" + name);
            const users = await postUser(name);
            res.render('users/index', { users }); // Pass the users to the view
        } catch (error) {
            logError(error, 'handling users request');
            sendServerError(res);
        }
    });

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

    app.get('/todos/new', async (req, res) => {
        // ユーザーデータを'todos/new'に渡す
        const users = await fetchUsers();
        console.log("users" + users);

        // ぁてごりーデータを'todos/new'に渡す
        const categories = await fetchCategories();
        res.render('todos/new', { users, categories });
    });

    app.post('/todos', async (req, res) => {
        try {
            const { title, user_id, category_ids } = req.body;
            console.log("req.body " + JSON.stringify(req.body));
            console.log("user_id " + user_id);
            await postTodosWithRelation(title, user_id, category_ids);
            res.redirect('/');
        } catch (error) {
            logError(error, 'handling root request');
            sendServerError(res);
        }
    });
};
