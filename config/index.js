// config.js
require('dotenv').config();

const youtubeConfig = {
    apiKey: process.env.YOUTUBE_API_KEY,
    maxResults: '10',
    videoType: 'video',
    orderBy: 'date',
    part: 'snippet',
};

const siteUrl = process.env.SITE_URL;

module.exports = { youtubeConfig, siteUrl };
