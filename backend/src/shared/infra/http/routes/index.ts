import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import accountRouter from '@modules/users/infra/http/routes/account.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import followRouter from '@modules/users/infra/http/routes/follow.routes';

import postRouter from '@modules/posts/infra/http/routes/post.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/sessions', sessionRouter);
routes.use('/activate', accountRouter);
routes.use('/password', passwordRouter);
routes.use('/', followRouter);

routes.use('/posts', postRouter);

export default routes;
