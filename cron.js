import nodeCron from 'node-cron';
import { parse } from './src/parse.js';

const updateTask = nodeCron.schedule('30 10 * * *', () => {
  parse();
});

updateTask.start();
