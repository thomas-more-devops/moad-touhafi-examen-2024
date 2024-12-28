import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mysql.createConnection({
                host: process.env.db_host,
                user: process.env.db_user,
                password: process.env.db_pass,
                database: process.env.db_name,
                port: process.env.db_port,
            });
        }
        return this.connection;
    }

    async getQuery(sql, params = []) {
        const connection = await this.connect();

        try {
            const [rows] = await connection.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error.message);
            // This matches the test's expectation:
            throw new Error('Database error');
        }
    }

    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.end();
            } catch (error) {
                // Bubble up the error so Jest sees it:
                throw new Error(error.message);
            }
            this.connection = null;
        }
    }
}

export default Database;
