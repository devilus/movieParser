import { parseIDs } from './utils/parseIDs.js';
import { parseData } from './utils/parseData.js';

const { log } = console;

export const parse = async (options = { forceUpdate: false }) => {
  log('IDs parsing...');
  const movieIDs = await parseIDs(options);

  log(`Data parsing of ${movieIDs.length} movies...`);
  parseData(...movieIDs);
};
