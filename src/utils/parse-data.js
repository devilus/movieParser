import _ from 'lodash';
import { axiosInstance } from '../../settings/axios.js';
import { stepTimeout } from './step-timeout.js';
import { saveData } from './save-data.js';

export const parseData = (...movieIDs) => {
  console.log(`Data parsing of ${movieIDs.length} movies...`);

  const chunkSize = 10;
  const chunks = _.chunk(movieIDs, chunkSize);

  const getChunk = (chunkNum) => chunks[chunkNum] ?? null;

  const makeRangeString = (chunkNum) => {
    const { length } = getChunk(chunkNum);
    const chunkEnd = length < chunkSize ? length : (chunkNum + 1) * chunkSize;
    const chunkStart = chunkEnd - length + 1;

    return `[${chunkStart}-${chunkEnd}]`;
  };

  const parseChunk = async (chunkNum) => {
    const chunk = getChunk(chunkNum);

    if (!chunk) {
      console.log('Parsing completed');
      return;
    }

    // Build promises collection
    const promises = chunk.map(
      (movieID, index) =>
        new Promise((resolve, reject) => {
          stepTimeout(async () => {
            const response = await axiosInstance.get(`${movieID}`);
            const movieData = response.data.item;

            resolve(movieData);
            reject(new Error('Parsing error'));
          }, index);
        })
    );

    // Save to db
    try {
      const data = await Promise.all(promises);
      await saveData(...data);
      console.log(`Parsed data chunk: ${makeRangeString(chunkNum)}`);
      parseChunk(chunkNum + 1); // Run with the next data chunk
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        parseChunk(chunkNum); // Rerun with the same data chunk
      }, 60000);
    }
  };

  return parseChunk(0);
};
