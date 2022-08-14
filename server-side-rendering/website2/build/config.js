import path from 'path'

export default {
  dotenv: path.resolve(__dirname, "../.env"),
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
