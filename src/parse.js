import { parseIDs } from './utils/parse-ids.js';
import { parseData } from './utils/parse-data.js';

export const parse = async (options = { forceUpdate: false }) => {
  const movieIDs = await parseIDs(options);
  parseData(...movieIDs);
};
