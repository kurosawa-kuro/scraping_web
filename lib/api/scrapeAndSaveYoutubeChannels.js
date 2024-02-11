const axios = require('axios');
const dbPool = require('../database'); // Adjust the path if necessary
const { youtubeConfig } = require('../../config'); // Adjust the path if necessary
const channelList = require('../../data/channels.json'); // Adjust the path if necessary

async function fetchYoutubeVideos(channelId) {
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=${youtubeConfig.part}&channelId=${channelId}&maxResults=${youtubeConfig.maxResults}&order=${youtubeConfig.orderBy}&type=${youtubeConfig.videoType}&key=${youtubeConfig.apiKey}`;
    try {
        const { data } = await axios.get(apiUrl);
        return data.items.map(({ snippet, id }) => ({
            channelName: snippet.channelTitle,
            title: snippet.title,
            videoId: id.videoId,
            videoUrl: `https://www.youtube.com/watch?v=${id.videoId}`, // Construct video URL
            thumbnailUrl: snippet.thumbnails.high.url,
            publishedAt: snippet.publishedAt,
        }));
    } catch (error) {
        console.error(`Failed to fetch videos for channel ${channelId}:`, error);
    }
}

async function saveVideoDetails(videoDetails) {
    const query = `
        INSERT INTO channels(channelName, title, videoId, url, thumbnailUrl, publishedAt)
        VALUES($1, $2, $3, $4, $5, $6)
        ON CONFLICT (videoId) DO NOTHING;
    `;
    try {
        await dbPool.query(query, [videoDetails.channelName, videoDetails.title, videoDetails.videoId, videoDetails.videoUrl, videoDetails.thumbnailUrl, videoDetails.publishedAt]);
    } catch (error) {
        console.error('Failed to save video details:', error);
    }
}

async function scrapeAndSaveYoutubeChannels() {
    for (const { id } of channelList) {
        const videos = await fetchYoutubeVideos(id);
        if (videos) {
            for (const video of videos) {
                await saveVideoDetails(video);
            }
        }
    }
}

module.exports = scrapeAndSaveYoutubeChannels;