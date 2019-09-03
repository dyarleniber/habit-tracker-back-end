import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import HabitController from './app/controllers/HabitController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/users', UserController.show);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);

routes.get('/habits', HabitController.index);
routes.get('/habits/:id', HabitController.show);
routes.post('/habits', HabitController.store);
routes.put('/habits/:id', HabitController.update);
routes.delete('/habits/:id', HabitController.delete);
routes.post('/habits/:id/check', HabitController.check);

export default routes;
