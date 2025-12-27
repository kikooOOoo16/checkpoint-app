import config from 'config';
import 'reflect-metadata';
import cors from 'cors';
import {useExpressServer} from 'routing-controllers';
import express, {Express, RequestHandler} from 'express';
import {AdminController, AuthController, DashboardController, HealthController, VisitorController} from './controller';
import {logger, LogNamespace} from './logger';
import {ErrorHandlerMiddleware, logRequestBodyMiddleware} from './middleware';
import * as httpContext from 'express-http-context';
import session from 'express-session';
import path from 'path';

export const startServer = (port: number): Express => {
  const BODY_SIZE_LIMIT = process.env.JSON_BODY_SIZE_LIMIT || '500kb';
  const expressApp: Express = express()
    // adds possibility to work with CORS requests (for swagger is needed)
    .use(cors() as RequestHandler)
    // add bodyParser for converting from short oneM2M to long in middleware
    .use(
      express.json({
        limit: BODY_SIZE_LIMIT,
        type: ['json', '+json']
      })
    )
    .use(express.urlencoded({limit: BODY_SIZE_LIMIT, extended: true}))
    // enable httpContext
    .use(httpContext.middleware)
    .use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: process.env.NODE_ENV === 'PRD'}
      }) as any
    )
    .enable('trust proxy');

  expressApp.set('view engine', 'ejs');
  expressApp.set('views', path.join(__dirname, '../views'));
  expressApp.use(express.static(path.join(__dirname, '../public')));

  if (process.env.NODE_ENV !== 'PRD') {
    expressApp.use(logRequestBodyMiddleware);
  }

  useExpressServer(expressApp, {
    controllers: [HealthController, VisitorController, AdminController, AuthController, DashboardController],
    routePrefix: config.get('ROUTES_PREFIX'),
    middlewares: [ErrorHandlerMiddleware],
    defaultErrorHandler: false
  });

  // binding server to port
  expressApp.listen(port, () => {
    logger(LogNamespace.SERVER_NAMESPACE).info(`Server running on port ${port}`);
  });

  return expressApp;
};
