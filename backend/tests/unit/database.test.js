const Database = require('../../classes/database');
const mysql = require('mysql2/promise');

jest.mock('mysql2/promise');

describe('Database', () => {
  let database;
  let mockConnection;
  let mockExecute;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockExecute = jest.fn();
    mockConnection = {
      execute: mockExecute
    };

    mysql.createConnection.mockResolvedValue(mockConnection);

    database = new Database();

    process.env.db_host = 'localhost';
    process.env.db_user = 'user';
    process.env.db_pass = 'password';
    process.env.db_name = 'database';
    process.env.db_port = '3306';
  });

  describe('connect', () => {
    it('creates a connection with correct config', async () => {
      await database.connect();

      expect(mysql.createConnection).toHaveBeenCalledWith({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'database',
        port: '3306'
      });
    });

    it('returns the connection object', async () => {
      const connection = await database.connect();
      expect(connection).toBe(mockConnection);
    });
  });

  describe('getQuery', () => {
    it('executes query with parameters', async () => {
      const sql = 'SELECT * FROM table WHERE id = ?';
      const params = [1];
      mockExecute.mockResolvedValue([['row1', 'row2']]);

      const result = await database.getQuery(sql, params);

      expect(mockExecute).toHaveBeenCalledWith(sql, params);
      expect(result).toEqual(['row1', 'row2']);
    });

    it('handles database errors', async () => {
      const sql = 'SELECT * FROM table';
      const error = new Error('Database error');
      mockExecute.mockRejectedValue(error);

      await expect(database.getQuery(sql)).rejects.toThrow('Database error');
    });
  });
});
