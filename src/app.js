import './bootstrap';

import express from 'express';
import 'express-async-errors';

import routes from './routes';
import databaseHelper from './app/helpers/database';
import Logger from './lib/Logger';

class App {
  constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  database() {
    databaseHelper.connect();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }

  exceptionHandler() {
    this.express.use((err, req, res, next) => {
      Logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );

      return res
        .status(err.status || 500)
        .json({ error: 'Internal server error' });
    });
  }
}

export default new App().express;
