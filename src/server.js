import './bootstrap';

import express from 'express';
import 'express-async-errors';

import routes from './routes';
import databaseHelper from './app/helpers/database';

class App {
  constructor() {
    this.server = express();

    this.database();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  database() {
    databaseHelper.connect();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      console.log(err);

      return res
        .status(err.status || 500)
        .json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
