/* Copyright T-Systems International GmbH 2019 */
import {startServer} from './server';
import pjson from '../package.json';
import config from 'config';
import {logger} from './logger';

const env = process.env.NODE_ENV || 'PRD';
const port = config.get<number>('PORT');
logger().info(`Starting ${pjson.name} v${pjson.version} ENV=${env} ...`);

startServer(port);
logger().info(`... app listening on port ${port}`);
