const axios = require('axios');
const cheerio = require('cheerio');
const dbPool = require('../database'); // パスが正しいことを確認
require('dotenv').config();
const { siteUrl } = require('../../config'); // パスが正しいことを確認

async function scrapeAndSaveMangaTitles() {
    console.log('Scraping manga titles from:', siteUrl);
    try {
        // sites_masterテーブルからURLを抽出
        const sitesResult = await dbPool.query('SELECT url FROM sites_master');
        console.log(`Found ${sitesResult.rows.length} sites to scrape.`);

        // 各サイトのURLでループ
        for (const site of sitesResult.rows) {
            console.log('Scraping:', site.url);
            const { data } = await axios.get(site.url);
            const $ = cheerio.load(data);
            const mangaDetails = [];

            // コミックの詳細を収集
            $('div.post').each((_, elem) => {
                const title = $(elem).find('h2 a').text().trim();
                const url = $(elem).find('h2 a').attr('href');
                const thumbnailUrl = $(elem).find('img').attr('src');
                const dateTextRaw = $(elem).find('.metabar em').text();
                const dateRegex = /On (\w+ \d{1,2}, \d{4}),/;
                const match = dateRegex.exec(dateTextRaw);
                const dateStr = match ? match[1] : 'Unknown date';
                const dateObj = new Date(dateStr);
                const formattedDate = dateObj !== 'Invalid Date' ? dateObj.toISOString() : null;

                mangaDetails.push({ title, url, date: formattedDate, thumbnailUrl });
            });

            // データベースに挿入
            for (const detail of mangaDetails) {
                const query = `INSERT INTO sites(title, url, publishedAt, thumbnailUrl) VALUES($1, $2, $3, $4) ON CONFLICT (title) DO NOTHING`;
                await dbPool.query(query, [detail.title, detail.url, detail.date, detail.thumbnailUrl])
                    .catch(error => console.error('Failed to save manga detail:', error));
            }
        }
    } catch (error) {
        console.error('Failed to scrape manga titles:', error);
    }
}

module.exports = scrapeAndSaveMangaTitles;
