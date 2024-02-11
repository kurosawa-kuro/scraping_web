-- channels というテーブルを作成 
-- id,name,created_at,updated_at というカラムを持つ
-- name はユニークである
Drop TABLE IF EXISTS channels;

CREATE TABLE channels (
  id SERIAL PRIMARY KEY,
  channelName VARCHAR(255) ,
  title VARCHAR(255) UNIQUE NOT NULL,
  videoId VARCHAR(255) UNIQUE NOT NULL,
  url VARCHAR(2048) NOT NULL, 
  thumbnailUrl VARCHAR(255) NOT NULL,
  publishedAt TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS sites;

CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  title VARCHAR(512) UNIQUE NOT NULL, -- Increased size for titles
  publishedAt TIMESTAMP NOT NULL,
  url VARCHAR(2048) NOT NULL, 
  thumbnailUrl VARCHAR(2048) NOT NULL, -- Increased size for URLs
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
