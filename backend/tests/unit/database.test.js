/**
 * @jest-environment node
 */
import { jest } from '@jest/globals';

// 1. Use jest.unstable_mockModule for ESM mocking.
jest.unstable_mockModule('mysql2/promise', () => ({
  default: {
    createConnection: jest.fn(),
  },
}));

// 2. Dynamically import the code under test **after** the mock is declared.
const { default: Database } = await import('../../classes/database.js');

describe('Database (ESM)', () => {
  let mockExecute;
  let mockEnd;
  let mockConnection;
  let mysql2;
  let database;

  // We configure our test environment before each spec
  beforeEach(async () => {
    // Dynamically import the ESM module for mysql2/promise
    mysql2 = (await import('mysql2/promise')).default;

    mockExecute = jest.fn();
    mockEnd = jest.fn();
    mockConnection = {
      execute: mockExecute,
      end: mockEnd,
    };

    // Make createConnection return the mock connection
    mysql2.createConnection.mockResolvedValue(mockConnection);

    // Instantiate our Database class
    database = new Database();

    // Mock up environment variables
    process.env.db_host = 'localhost';
    process.env.db_user = 'user';
    process.env.db_pass = 'password';
    process.env.db_name = 'database';
    process.env.db_port = '3306';
  });

  describe('connect', () => {
    it('creates a connection with correct config', async () => {
      await database.connect();

      expect(mysql2.createConnection).toHaveBeenCalledWith({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'database',
        port: '3306',
      });
    });

    it('returns the connection object', async () => {
      const connection = await database.connect();
      expect(connection).toBe(mockConnection);
    });

    it('throws an error if connection fails', async () => {
      mysql2.createConnection.mockRejectedValueOnce(new Error('Connection failed'));
      await expect(database.connect()).rejects.toThrow('Connection failed');
    });
  });

  describe('getQuery', () => {
    it('executes query with parameters and returns results', async () => {
      const sql = 'SELECT * FROM table WHERE id = ?';
      const params = [1];
      mockExecute.mockResolvedValue([['row1', 'row2']]);

      const result = await database.getQuery(sql, params);
      expect(mockExecute).toHaveBeenCalledWith(sql, params);
      expect(result).toEqual(['row1', 'row2']);
    });

    it('handles database query errors', async () => {
      const sql = 'SELECT * FROM table';
      const error = new Error('Database error');
      mockExecute.mockRejectedValue(error);

      await expect(database.getQuery(sql)).rejects.toThrow('Database error');
    });
  });

  describe('disconnect', () => {
    it('closes the connection successfully', async () => {
      await database.connect(); // Establish the connection
      await database.disconnect(); // Disconnect
      expect(mockEnd).toHaveBeenCalled(); // Ensure connection is closed
    });

    it('handles errors when closing connection', async () => {
      await database.connect(); // Make sure there's an actual connection
      mockEnd.mockRejectedValueOnce(new Error('Failed to close connection'));

      await expect(database.disconnect()).rejects.toThrow('Failed to close connection');
    });
  });
});
