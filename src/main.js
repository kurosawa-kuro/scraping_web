// Assuming this code is in main.js or similar
require('dotenv').config();
const dbPool = require('../lib/database.js');
const scrapeAndSaveYoutubeChannels = require('../lib/api/scrapeAndSaveYoutubeChannels.js');
const scrapeAndSaveMangaTitles = require('../lib/api/scrapeAndSaveMangaTitles.js'); // Assuming you've also modularized this function similarly
const retrieveAndPrintTop = require('../lib/retrieveAndPrintTop.js');

async function main() {
    // await scrapeAndSaveYoutubeChannels();
    await scrapeAndSaveMangaTitles();
    await retrieveAndPrintTop();
    await dbPool.end();
}

main().catch(console.error);
