import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routes/contacts.js';
import authRouters from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { auth } from './middlewares/auth.js';
import path from 'node:path';
import swaggerUiExpress from 'swagger-ui-express';
import * as fs from 'node:fs';

export const setupServer = async () => {
  const SWAGGER_DOCUMENT = JSON.parse(
    fs.readFileSync(path.join('docs', 'swagger.json')),
  );

  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use('/photos', express.static(path.resolve('src', 'uploads', 'photos')));

  app.use(cors());
  app.use(pino());

  app.use('/auth', authRouters);
  app.use('/contacts', auth, contactsRouter);
  app.use(
    '/api-docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(SWAGGER_DOCUMENT),
  );

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = getEnvVar('PORT', 3000);

  await initMongoConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
