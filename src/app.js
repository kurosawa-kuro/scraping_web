// Dependencies
const express = require('express');
const path = require('path');
require('dotenv').config();

// Application Setup
const app = express();
const port = 3000;

// Custom Modules

const scrapeAndSaveYoutubeChannels = require('../lib/api/scrapeAndSaveYoutubeChannels.js');
const scrapeAndSaveMangaTitles = require('../lib/api/scrapeAndSaveMangaTitles');
const retrieveAndPrintTop = require('../lib/retrieveAndPrintTop');

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route Handlers
async function handleRootRequest(req, res) {
    try {
        await scrapeAndSaveYoutubeChannels();
        await scrapeAndSaveMangaTitles();
        const result = await retrieveAndPrintTop();
        // console.log('result:', result);
        res.render('index', { result });
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
