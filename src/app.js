// Dependencies
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // express-ejs-layoutsをインポート
require('dotenv').config();

// Application Setup
const app = express();
const port = process.env.PORT || 3000;

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts); // express-ejs-layoutsを使用するように設定

app.set('layout', 'layouts/layout'); // デフォルトのレイアウトを設定

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
