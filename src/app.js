// Dependencies
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

// Application Setup
const app = express();
const port = process.env.PORT || 3000;

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts); // Set up express-ejs-layouts
app.set('layout', 'layouts/layout'); // Set default layout
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const { fetchTodosWithRelation, fetchCategories, postCategory } = require('./model/');

// Route Handlers

// Display categories list
app.get('/categories', async (req, res) => {
    try {
        const categories = await fetchCategories();
        res.render('categories/index', { categories });
    } catch (error) {
        console.error('Error handling categories request:', error);
        res.status(500).send('Server error');
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
        // Assume 'postCategory' is a function to add a category to the database
        // This should be implemented in './model/'
        await postCategory(title);
        res.redirect('/categories');
    } catch (error) {
        console.error('Error adding new category:', error);
        res.status(500).send('Server error');
    }
});

// Handle root request
app.get('/', async (req, res) => {
    try {
        const todos = await fetchTodosWithRelation();
        res.render('index', { todos });
    } catch (error) {
        console.error('Error handling root request:', error);
        res.status(500).send('Server error');
    }
});

// Server Initialization
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
