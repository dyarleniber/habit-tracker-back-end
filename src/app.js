import './bootstrap';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import 'express-async-errors';

import routes from './routes';
import Logger from './lib/Logger';
import corsConfig from './config/cors';
import redisConfig from './config/redis';
import rateLimitConfig from './config/rateLimit';
import databaseHelper from './app/helpers/database';
import BadRequestError from './errors/BadRequestError';
import UnauthorizedError from './errors/UnauthorizedError';

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
    this.express.use(
      new RateLimit({
        store: new RateLimitRedis({
          client: redis.createClient({
            host: redisConfig.host,
            port: redisConfig.port,
          }),
        }),
        windowMs: rateLimitConfig.windowMs,
        max: rateLimitConfig.max,
      })
    );
    this.express.use(helmet());
    this.express.use(cors(corsConfig));
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }

  exceptionHandler() {
    this.express.use((err, req, res, next) => {
      if (err instanceof BadRequestError) {
        return res.status(400).json({ error: err.message });
      }

      if (err instanceof UnauthorizedError) {
        return res.status(401).json({ error: err.message });
      }

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
