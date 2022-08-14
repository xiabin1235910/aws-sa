// this file must be put in the first line, since dotenv config will initialize
import buildEnv from '../build/env.js'

import express from 'express'
import chalk from 'chalk'
import initMiddleware from './middleware/index.js'

const app = express();
const env = buildEnv().raw
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
