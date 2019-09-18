import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import redisConfig from './config/redis';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import HabitController from './app/controllers/HabitController';

import UserStoreValidator from './app/validators/UserStore';
import UserUpdateValidator from './app/validators/UserUpdate';
import SessionStoreValidator from './app/validators/SessionStore';
import HabitIndexValidator from './app/validators/HabitIndex';
import HabitStoreValidator from './app/validators/HabitStore';
import HabitUpdateValidator from './app/validators/HabitUpdate';
import HabitGetByDateValidator from './app/validators/HabitGetByDate';

import authMiddleware from './app/middlewares/auth';

const bruteStore = new BruteRedis({
  host: redisConfig.host,
  port: redisConfig.port,
});

const bruteForce = new Brute(bruteStore);

const routes = new Router();

routes.post('/users', UserStoreValidator, UserController.store);
routes.post(
  '/sessions',
  bruteForce.prevent,
  SessionStoreValidator,
  SessionController.store
);

routes.use(authMiddleware);

routes.get('/users', UserController.show);
routes.put('/users', UserUpdateValidator, UserController.update);
routes.delete('/users', UserController.delete);

routes.get('/habits', HabitIndexValidator, HabitController.index);
routes.get('/habits/:id', HabitController.show);
routes.post('/habits', HabitStoreValidator, HabitController.store);
routes.put('/habits/:id', HabitUpdateValidator, HabitController.update);
routes.delete('/habits/:id', HabitController.delete);
routes.get(
  '/habits/date/:date',
  HabitGetByDateValidator,
  HabitController.getByDate
);
routes.post('/habits/:id/check', HabitController.check);

export default routes;
