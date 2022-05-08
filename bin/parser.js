#!/usr/bin/env node
import { Command } from 'commander';
import { parse } from '../src/parse.js';

const program = new Command();

program
  .name('parser')
  .description('CLI for parsing movies by API')
  .option('-f, --force-update', 'Force update & override all entries', false)
  .version('1.0.0');

program.parse();

await parse({ ...program.opts() });
