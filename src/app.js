// Dependencies
const express = require('express');
const path = require('path');
require('dotenv').config();

// Application Setup
const app = express();
const port = 3000 || process.env.PORT;

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const { fetchTodosWithRelation } = require('./lib/api/');

// Route Handlers
async function handleRootRequest(req, res) {
    try {
        const todos = await fetchTodosWithRelation();
        res.render('index', { todos });
    } catch (error) {
        console.error('Error handling root request:', error);
        res.status(500).send('Server error');
    }
}


// Routes
app.get('/', handleRootRequest);

// Server Initialization
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
