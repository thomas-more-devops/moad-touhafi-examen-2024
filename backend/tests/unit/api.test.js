const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('../../classes/database');

// Mock Database class
jest.mock('../../classes/database');

describe('API Endpoints', () => {
  let app;
  let mockGetQuery;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock for getQuery
    mockGetQuery = jest.fn();
    Database.mockImplementation(() => ({
      getQuery: mockGetQuery
    }));

    // Create a fresh express app for each test
    app = express();
    app.use(cors({
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(bodyParser.json());

    // Set up routes
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.get('/api/artists', (req, res) => {
      const db = new Database();
      db.getQuery('SELECT * FROM artists').then((artists) => {
          res.send(artists);
      });
    });

    app.get('/api/votes', (req, res) => {
      const db = new Database();
      db.getQuery('SELECT * FROM votes').then((votes) => {
          res.send(votes);
      });
    });

    app.get('/api/songs', (req, res) => {
      const db = new Database();
      db.getQuery(`
          SELECT
              song_id, s.name AS songname, a.name AS artistname
          FROM
              songs AS s
                  INNER JOIN
                      artists AS a
                          ON
                              s.artist_id = a.artist_id;
      `).then((songs) => {
          res.send(songs);
      });
    });

    app.get('/api/ranking', (req, res) => {
      const db = new Database();
      db.getQuery(`
          SELECT songs.song_id, songs.name AS song_name, artists.name AS artist_name, SUM(points) AS total_points
          FROM
              votes
                  INNER JOIN
                      songs
                          ON songs.song_id = votes.song_id
                  INNER JOIN
                      artists
                          ON songs.artist_id = artists.artist_id
          GROUP BY song_id
          ORDER BY SUM(points) DESC;
      `).then((ranking) => {
          res.send(ranking);
      });
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

    app.post('/api/votes', (req, res) => {
      const { song_id, points } = req.body;
      const db = new Database();
      db.getQuery('INSERT INTO votes (song_id, points) VALUES (?, ?)', [song_id, points])
          .then(() => res.status(201).send({ message: 'Vote added successfully' }))
          .catch((error) => res.status(500).send({ error: 'Failed to add vote', details: error }));
    });
  });

  describe('GET /api/artists', () => {
    it('returns all artists', async () => {
      const mockArtists = [
        { artist_id: 1, name: 'Artist 1' },
        { artist_id: 2, name: 'Artist 2' }
      ];
      mockGetQuery.mockResolvedValue(mockArtists);

      const response = await request(app)
        .get('/api/artists')
        .expect(200);

      expect(response.body).toEqual(mockArtists);
      expect(mockGetQuery).toHaveBeenCalledWith('SELECT * FROM artists');
    });
  });

  describe('GET /api/songs', () => {
    it('returns all songs with artist information', async () => {
      const mockSongs = [
        { song_id: 1, songname: 'Song 1', artistname: 'Artist 1' },
        { song_id: 2, songname: 'Song 2', artistname: 'Artist 2' }
      ];
      mockGetQuery.mockResolvedValue(mockSongs);

      const response = await request(app)
        .get('/api/songs')
        .expect(200);

      expect(response.body).toEqual(mockSongs);
      expect(mockGetQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
    });
  });

  describe('GET /api/ranking', () => {
    it('returns ranking information', async () => {
      const mockRanking = [
        { song_id: 1, song_name: 'Song 1', artist_name: 'Artist 1', total_points: 10 },
        { song_id: 2, song_name: 'Song 2', artist_name: 'Artist 2', total_points: 5 }
      ];
      mockGetQuery.mockResolvedValue(mockRanking);

      const response = await request(app)
        .get('/api/ranking')
        .expect(200);

      expect(response.body).toEqual(mockRanking);
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

    it('handles errors when creating artist', async () => {
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

    it('handles errors when creating vote', async () => {
      mockGetQuery.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/votes')
        .send({ song_id: 1, points: 5 })
        .expect(500);

      expect(response.body.error).toBe('Failed to add vote');
    });
  });
});
