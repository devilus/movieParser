import nodeCron from 'node-cron';
import { parse } from './src/parse.js';

const h = process.env.RUN_AT_HOUR || 12;
const m = process.env.RUN_AT_MINUTE || 0;

const updateTask = nodeCron.schedule(`${m} ${h} * * *`, () => {
  parse();
});

updateTask.start();
