import express from 'express';
import nodeCron from 'node-cron';
import { parse } from './src/parse.js';

const port = process.env.PORT || 3000;
const h = process.env.RUN_AT_HOUR || 12;
const m = process.env.RUN_AT_MINUTE || 0;

const updateTask = nodeCron.schedule(`0 * * * *`, () => {
  parse();
});

const forceUpdateTask = nodeCron.schedule(`${m} ${h} * * *`, () => {
  parse();
});

updateTask.start();
forceUpdateTask.start();

express().listen(port, () => console.log(`Listening on ${port}`));
