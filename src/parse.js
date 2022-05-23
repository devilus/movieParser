import { parseIDs } from './utils/parse-ids.js';
import { parseData } from './utils/parse-data.js';

export const parse = async (options = { forceUpdate: false }) => {
  try {
    console.log('Movie IDs parsing...');
    const movieIDs = await parseIDs(options);
    console.log(`Data parsing of ${movieIDs.length} movies...`);
    parseData(...movieIDs);
  } catch (error) {
    // console.log(error);
    console.log('Something went wrong. Waiting for restart...');
    setTimeout(() => {
      parse(options);
    }, 60000);
  }
};
