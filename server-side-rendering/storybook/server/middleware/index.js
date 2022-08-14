import { envMiddleware } from './environmentMiddleware.js'

console.log(envMiddleware)

export default (express, app, done) => {

  // environment based middlewares
  envMiddleware(express, app, done);

};
