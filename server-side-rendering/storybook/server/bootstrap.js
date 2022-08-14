import express from 'express'
import chalk from 'chalk'
import initMiddleware from './middleware/index.js'

import buildEnv from '../build/env.js'
const env = buildEnv().raw

const app = express();

/**
 * All application expressjs middleware
 */

const done = () => {
    app.listen(env.PORT, () => {
        console.info(
            `[${new Date().toISOString()}]`,
            chalk.blue(`App is running: 🌎 http://localhost:${env.PORT}`)
        );
    });
};

initMiddleware(express, app, done);

export default app;
