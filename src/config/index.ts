import * as dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const Config = {
  RANGE: Number(process.env.RANGE_API),
  DOMAIN: process.env.DOMAIN,
  DIR_NAME: process.cwd(),
  DIR_NAME_IMG: process.cwd() + '/static/img',
};

export default Config;
