import fs from 'fs'
import dotenv from 'dotenv'
import paths from './config.js'

if (!process.env.NODE_ENV) {
  throw new Error(
    "The process.env.NODE_ENV environment variable is required but was not specified."
  );
}

console.log(paths.dotenv)

const dotenvFiles = [
  `${paths.dotenv}.${process.env.NODE_ENV}.local`,
  `${paths.dotenv}.${process.env.NODE_ENV}`,
  process.env.NODE_ENV !== "test" && `${paths.dotenv}.local`,
  paths.dotenv,
].filter(Boolean);

const validDotFile = dotenvFiles.find((file) => {
  return fs.existsSync(file);
})

if (!validDotFile) {
  throw new Error(
    `no available env config file... pls prepared one for starting...
    1. .env.[process.env].local
    2. .env.[process.env]
    3. .env.local
    4. .env
    `
  )
}

dotenv.config({
  path: validDotFile
})

export default () => {
  const raw = {
    PORT: process.env.PORT || 3002,
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
};
