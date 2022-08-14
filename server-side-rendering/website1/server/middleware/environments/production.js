const fs = require("fs");
const path = require("path");
const config = require("../../../build/config");

const { serverPath, clientPath, publicPath } =
  config[process.env.NODE_ENV || "production"];

// Production specific middleware for express
module.exports = async (express, app, done) => {
  app.use(
    "/static_downstream",
    (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      next();
    },
    express.static(path.join(__dirname, "../buildClientDown/static"))
  );
  app.use(
    "/static_upstream",
    (req, res, next) => {
      res.set('Access-Control-Allow-Origin', '*');
      next();
    },
    express.static(path.join(__dirname, "../buildClientUp/static"))
  );
  app.use(
    "/server_downstream",
    express.static(path.join(__dirname, "../buildServerDown"))
  );
  app.use(
    "/server_upstream",
    express.static(path.join(__dirname, "../buildServerUp"))
  );

  const rederThunk = require("../../server-entry").default; // eslint-disable-line import/no-unresolved

  try {
    // static path where files such as images will be served from
    const serverRemder = rederThunk();
    app.get("/*", serverRemder);
  } catch (e) {
    throw new Error("Cant find webpack client stats file");
  }

  done();
};
