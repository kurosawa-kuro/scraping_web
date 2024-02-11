// dbPool.js
const dbPool = require('./database');
require('dotenv').config();

async function retrieveAndPrintTop() {
    const channels = await dbPool.query('SELECT channelName, title, url, thumbnailUrl, publishedAt FROM channels ORDER BY publishedAt DESC LIMIT 5');

    // console.log('Channels:', channels.rows);

    const sites = await dbPool.query('SELECT title, url, thumbnailUrl, publishedAt FROM sites ORDER BY publishedAt DESC LIMIT 20');
    // console.log('Sites:', sites.rows);
    // await dbPool.end();

    return { channels: channels.rows, sites: sites.rows };
}

module.exports = retrieveAndPrintTop;
