// src/app.js

// Dependencies
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

// Application Setup
const app = express();

// View Engine and Middleware Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));

// Import and use routes
require('./controller')(app); // Adjust the path as necessary

module.exports = { app };
