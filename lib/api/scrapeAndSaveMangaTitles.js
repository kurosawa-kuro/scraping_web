const axios = require('axios');
const cheerio = require('cheerio');
const dbPool = require('../database'); // Ensure this path is correct
require('dotenv').config();
const { siteUrl } = require('../../config'); // Ensure this path is correct

async function scrapeAndSaveMangaTitles() {
    console.log('Scraping manga titles from:', siteUrl);
    try {
        const { data } = await axios.get(siteUrl);
        const $ = cheerio.load(data);
        const mangaDetails = [];

        // Collect all manga details
        $('div.post').each((_, elem) => {
            const title = $(elem).find('h2 a').text();
            const url = $(elem).find('h2 a').attr('href'); // Get the URL link
            const thumbnailUrl = $(elem).find('img').attr('src');
            const dateTextRaw = $(elem).find('.metabar em').text();
            const dateRegex = /On (\w+ \d{1,2}, \d{4}),/;
            const match = dateRegex.exec(dateTextRaw);
            const dateStr = match ? match[1] : 'Unknown date';
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj !== 'Invalid Date' ? `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} 11:11:24.000` : null;

            mangaDetails.push({ title, url, date: formattedDate, thumbnailUrl }); // Include the URL in the details
        });

        // Insert them into the database one by one or in small batches
        for (const detail of mangaDetails) {
            const query = `INSERT INTO sites(title, url, publishedAt, thumbnailUrl) VALUES($1, $2, $3, $4) ON CONFLICT (title) DO NOTHING`;
            await dbPool.query(query, [detail.title, detail.url, detail.date, detail.thumbnailUrl])
                .catch(error => console.error('Failed to save manga details:', error));
        }
    } catch (error) {
        console.error('Failed to scrape manga titles:', error);
    }
}

module.exports = scrapeAndSaveMangaTitles;
