import { createPool } from 'mysql2';
// import util from 'util';

// Create the connection pool. The pool-specific settings are the defaults
export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: 'test',
    password: process.env.DB_PWD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Promise: util.promisify,
}).promise();