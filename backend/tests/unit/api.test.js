/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// 1. Mock the Database as ESM
jest.unstable_mockModule('../../classes/database.js', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      getQuery: jest.fn(),
    })),
  };
});

// 2. Then dynamically import everything we need
const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: cors } = await import('cors');
const { default: bodyParser } = await import('body-parser');
const { default: Database } = await import('../../classes/database.js');

describe('API Endpoints', () => {
  let app;
  let mockGetQuery;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock for the getQuery method in the Database class
    mockGetQuery = jest.fn();
    Database.mockImplementation(() => ({
      getQuery: mockGetQuery,
    }));

    // Initialize the Express app
    app = express();
    app.use(
      cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );
    app.use(bodyParser.json());

    // Define your routes for the tests
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.get('/api/artists', async (req, res) => {
      const db = new Database();
      const artists = await db.getQuery('SELECT * FROM artists');
      res.send(artists);
    });

    app.post('/api/artists', async (req, res) => {
      try {
        const { name } = req.body;
        const db = new Database();
        await db.getQuery('INSERT INTO artists (name) VALUES (?)', [name]);
        res.status(201).send({ message: 'Artist added successfully' });
      } catch (error) {
        res.status(500).send({ error: 'Failed to add artist', details: error.message });
      }
    });

    app.get('/api/songs', async (req, res) => {
      const db = new Database();
      const songs = await db.getQuery(`
        SELECT
          song_id, s.name AS songname, a.name AS artistname
        FROM
          songs AS s
        INNER JOIN
          artists AS a
        ON
          s.artist_id = a.artist_id;
      `);
      res.send(songs);
    });

    app.get('/api/ranking', async (req, res) => {
      const db = new Database();
      const ranking = await db.getQuery(`
        SELECT 
          songs.song_id, songs.name AS song_name, artists.name AS artist_name, 
          SUM(points) AS total_points
        FROM
          votes
        INNER JOIN
          songs ON songs.song_id = votes.song_id
        INNER JOIN
          artists ON songs.artist_id = artists.artist_id
        GROUP BY song_id
        ORDER BY SUM(points) DESC;
      `);
      res.send(ranking);
    });

    app.post('/api/votes', async (req, res) => {
      try {
        const { song_id, points } = req.body;
        const db = new Database();
        await db.getQuery('INSERT INTO votes (song_id, points) VALUES (?, ?)', [
          song_id,
          points,
        ]);
        res.status(201).send({ message: 'Vote added successfully' });
      } catch (error) {
        res.status(500).send({ error: 'Failed to add vote', details: error.message });
      }
    });
  });

  describe('GET /api/artists', () => {
    it('returns all artists', async () => {
      const mockArtists = [
        { artist_id: 1, name: 'Artist 1' },
        { artist_id: 2, name: 'Artist 2' },
      ];
      mockGetQuery.mockResolvedValue(mockArtists);

      const response = await request(app).get('/api/artists').expect(200);
      expect(response.body).toEqual(mockArtists);
      expect(mockGetQuery).toHaveBeenCalledWith('SELECT * FROM artists');
    });
  });

  describe('GET /api/songs', () => {
    it('returns all songs with artist information', async () => {
      const mockSongs = [
        { song_id: 1, songname: 'Song 1', artistname: 'Artist 1' },
        { song_id: 2, songname: 'Song 2', artistname: 'Artist 2' },
      ];
      mockGetQuery.mockResolvedValue(mockSongs);

      const response = await request(app).get('/api/songs').expect(200);
      expect(response.body).toEqual(mockSongs);
      expect(mockGetQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
    });
  });

  describe('POST /api/artists', () => {
    it('creates a new artist', async () => {
      mockGetQuery.mockResolvedValue({ insertId: 1 });

      const response = await request(app)
        .post('/api/artists')
        .send({ name: 'New Artist' })
        .expect(201);

      expect(response.body.message).toBe('Artist added successfully');
      expect(mockGetQuery).toHaveBeenCalledWith(
        'INSERT INTO artists (name) VALUES (?)',
        ['New Artist']
      );
    });

    it('handles errors when creating an artist', async () => {
      mockGetQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/artists')
        .send({ name: 'New Artist' })
        .expect(500);

      expect(response.body.error).toBe('Failed to add artist');
    });
  });

  describe('POST /api/votes', () => {
    it('creates a new vote', async () => {
      mockGetQuery.mockResolvedValue({ insertId: 1 });

      const response = await request(app)
        .post('/api/votes')
        .send({ song_id: 1, points: 5 })
        .expect(201);

      expect(response.body.message).toBe('Vote added successfully');
      expect(mockGetQuery).toHaveBeenCalledWith(
        'INSERT INTO votes (song_id, points) VALUES (?, ?)',
        [1, 5]
      );
    });

    it('handles errors when creating a vote', async () => {
      mockGetQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/votes')
        .send({ song_id: 1, points: 5 })
        .expect(500);

      expect(response.body.error).toBe('Failed to add vote');
    });
  });
});
