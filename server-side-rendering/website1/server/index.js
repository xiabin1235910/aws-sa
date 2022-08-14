const express = require("express");
const chalk = require("chalk");
const initMiddleware = require("./middleware");

const { raw: env } = require("../build/env")();

const app = express();

/**
 * All application expressjs middleware
 */
// likely dont need to track running server since im not stopping express, but webpack.
// might be useful to time the restart for when whatever the current request is complete
let runningServer;
const done = () => {
  runningServer = app.listen(env.PORT, () => {
    console.info(
      `[${new Date().toISOString()}]`,
      chalk.blue(`App is running: 🌎 http://localhost:${env.PORT}`)
    );
  });
};

app.use("/restart", (req, res) => {
  process.on("exit", function () {
    require("child_process").spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: false,
      stdio: "inherit",
    });
  });

  res.status = 200;
  res.send();
  res.on("finish", function () {
    console.log("OK response sent, killing and restarting application");

    process.exit();
  });

});
if (module.hot) {
  // module.hot.dispose(console.log)
  module.hot.accept("./index", () => {
    console.log("is hot reloading");
    // eslint-disable-next-line
    require("./index");
  });
}
console.log("basline app");
initMiddleware(express, app, done);

module.exports = app;
