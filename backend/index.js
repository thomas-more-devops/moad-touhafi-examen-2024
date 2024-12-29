// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Database from './classes/database.js';

// Winston & Morgan importeren
import morgan from 'morgan';
import logger from './logger.js';  // <-- Je eigen logger.js

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Configure the server
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Morgan vangt alle HTTP-requests af en logt deze via Winston
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Enable CORS
app.use(cors({
    origin: process.env.cors_origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Simple route
app.get('/', (req, res) => {
  logger.info({ 
    event: 'HelloWorldEndpointHit', 
    message: 'Root endpoint was called' 
  });
  res.send('Hello World!');
});

// GET /api/artists
app.get('/api/artists', async (req, res) => {
  const db = new Database();
  try {
    const artists = await db.getQuery('SELECT * FROM artists');
    res.send(artists);
  } catch (error) {
    // Gestructureerde error-log
    logger.error({
      event: 'FailedToFetchArtists',
      message: error.message,
      stack: error.stack,
      // evt. meer context, bijv. user: req.user?.id
    });
    res.status(500).send({ error: 'Failed to fetch artists', details: error.message });
  }
});

// GET /api/votes
app.get('/api/votes', async (req, res) => {
  const db = new Database();
  try {
    const votes = await db.getQuery('SELECT * FROM votes');
    res.send(votes);
  } catch (error) {
    logger.error({
      event: 'FailedToFetchVotes',
      message: error.message,
      stack: error.stack,
    });
    res.status(500).send({ error: 'Failed to fetch votes', details: error.message });
  }
});

// GET /api/songs
app.get('/api/songs', async (req, res) => {
  const db = new Database();
  try {
    const songs = await db.getQuery(`
      SELECT
        song_id, s.name AS song_name, a.name AS artist_name
      FROM
        songs AS s
        INNER JOIN artists AS a ON s.artist_id = a.artist_id;
    `);
    res.send(songs);
  } catch (error) {
    logger.error({
      event: 'FailedToFetchSongs',
      message: error.message,
      stack: error.stack,
    });
    res.status(500).send({ error: 'Failed to fetch songs', details: error.message });
  }
});

// GET /api/ranking
app.get('/api/ranking', async (req, res) => {
  const db = new Database();
  try {
    const ranking = await db.getQuery(`
      SELECT songs.song_id, songs.name AS song_name, artists.name AS artist_name, SUM(points) AS total_points
      FROM votes
        INNER JOIN songs ON songs.song_id = votes.song_id
        INNER JOIN artists ON songs.artist_id = artists.artist_id
      GROUP BY song_id
      ORDER BY SUM(points) DESC;
    `);
    res.send(ranking);
  } catch (error) {
    logger.error({
      event: 'FailedToFetchRanking',
      message: error.message,
      stack: error.stack,
    });
    res.status(500).send({ error: 'Failed to fetch ranking', details: error.message });
  }
});

// POST /api/artists
app.post('/api/artists', async (req, res) => {
  const { name } = req.body;
  const db = new Database();
  try {
    await db.getQuery('INSERT INTO artists (name) VALUES (?)', [name]);
    res.status(201).send({ message: 'Artist added successfully' });
  } catch (error) {
    logger.error({
      event: 'FailedToAddArtist',
      message: error.message,
      stack: error.stack,
      requestBody: req.body, // Extra info, optioneel
    });
    res.status(500).send({ error: 'Failed to add artist', details: error.message });
  }
});

// POST /api/songs
app.post('/api/songs', async (req, res) => {
  const { name, artist_id } = req.body;
  const db = new Database();
  try {
    await db.getQuery('INSERT INTO songs (name, artist_id) VALUES (?, ?)', [name, artist_id]);
    res.status(201).send({ message: 'Song added successfully' });
  } catch (error) {
    logger.error({
      event: 'FailedToAddSong',
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).send({ error: 'Failed to add song', details: error.message });
  }
});

// POST /api/votes
app.post('/api/votes', async (req, res) => {
  const { song_id, points } = req.body;
  const db = new Database();
  try {
    await db.getQuery('INSERT INTO votes (song_id, points) VALUES (?, ?)', [song_id, points]);
    res.status(201).send({ message: 'Vote added successfully' });
  } catch (error) {
    logger.error({
      event: 'FailedToAddVote',
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).send({ error: 'Failed to add vote', details: error.message });
  }
});

// Start the server
app.listen(port, host, () => {
  logger.info({ 
    event: 'ServerStart', 
    message: `Server running at http://${host}:${port}/` 
  });
});
