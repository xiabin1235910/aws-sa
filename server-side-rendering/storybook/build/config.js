import path from 'path'

const __dirname = path.resolve();

export default {
  dotenv: path.resolve(__dirname, ".env"),
  development: {
    clientPath: path.resolve(__dirname, "../buildClient"),
    serverPath: path.resolve(__dirname, "../buildServer"),
    publicPath: "/static/",
  },
  production: {
    clientPath: path.resolve(__dirname, "../buildClient"),
    serverPath: path.resolve(__dirname, "../buildServer"),
    publicPath: "/static/",
  },
};
