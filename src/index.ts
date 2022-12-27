import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import api from './api/index';
import imgs from './api/img';
import Config from './config';

const app: Application = express();
const staticFolder = path.join(Config.DIR_NAME, '/src/public');

dotenv.config();
app.use(cookieParser());

const PORT = process.env.PORT;

app.all('/api/*', function (req, res, next) {
  const allowedOrigins = process.env.DOMAIN_ORIGINS;
  const origin = req.headers.origin;

  if (origin && allowedOrigins && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Set-cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use(express.static(staticFolder));

app.use('/api', api);
app.use('/img', imgs);

app.get('/', (_req: Request, res: Response) => {
  res.end('<h1>hello heroku</h1>');
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));
