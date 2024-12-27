// Import modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Database from './classes/database.js';

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Configure the server
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Enable CORS
app.use(cors({
    origin: process.env.cors_origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/artists', async (req, res) => {
    const db = new Database();
    try {
        const artists = await db.getQuery('SELECT * FROM artists');
        res.send(artists);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch artists', details: error });
    }
});

app.get('/api/votes', async (req, res) => {
    const db = new Database();
    try {
        const votes = await db.getQuery('SELECT * FROM votes');
        res.send(votes);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch votes', details: error });
    }
});

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
        res.status(500).send({ error: 'Failed to fetch songs', details: error });
    }
});

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
        res.status(500).send({ error: 'Failed to fetch ranking', details: error });
    }
});

app.post('/api/artists', async (req, res) => {
    const { name } = req.body;
    const db = new Database();
    try {
        await db.getQuery('INSERT INTO artists (name) VALUES (?)', [name]);
        res.status(201).send({ message: 'Artist added successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add artist', details: error });
    }
});

app.post('/api/songs', async (req, res) => {
    const { name, artist_id } = req.body;
    const db = new Database();
    try {
        await db.getQuery('INSERT INTO songs (name, artist_id) VALUES (?, ?)', [name, artist_id]);
        res.status(201).send({ message: 'Song added successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add song', details: error });
    }
});

app.post('/api/votes', async (req, res) => {
    const { song_id, points } = req.body;
    const db = new Database();
    try {
        await db.getQuery('INSERT INTO votes (song_id, points) VALUES (?, ?)', [song_id, points]);
        res.status(201).send({ message: 'Vote added successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to add vote', details: error });
    }
});

// Start the server
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
