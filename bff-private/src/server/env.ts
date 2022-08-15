import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// delete require.cache[require.resolve("./config")];

if (!process.env.NODE_ENV) {
  throw new Error(
    "The process.env.NODE_ENV environment variable is required but was not specified."
  );
}

const dotenvPath = path.resolve(__dirname, "../../.env");

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotenvPath}.${process.env.NODE_ENV}.local`,
  `${dotenvPath}.${process.env.NODE_ENV}`,
  dotenvPath,
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    dotenv.config({
      path: dotenvFile,
    });
  }
});
