import _ from 'lodash';
import { axiosClient } from '../../settings/axios.js';
import { stepTimeout } from './step-timeout.js';
import { saveData } from './save-data.js';

const chunkSize = 10;

const makeRequestPromise = (movieID, index) =>
  new Promise((resolve, reject) => {
    stepTimeout(() => {
      axiosClient
        .get(`${movieID}`)
        .then((response) => {
          const movieData = response.data.item;
          resolve(movieData);
        })
        .catch(() => {
          reject(new Error('Parsing error'));
        });
    }, index);
  });

export const parseData = (...movieIDs) => {
  const chunks = _.chunk(movieIDs, chunkSize);
  const getChunk = (chunkNum) => chunks[chunkNum] ?? null;

  const makeRangeText = (chunkNum) => {
    const { length } = getChunk(chunkNum);
    const chunkEnd = length < chunkSize ? length : (chunkNum + 1) * chunkSize;
    const chunkStart = chunkEnd - length + 1;

    return `${chunkNum + 1} - [${chunkStart}-${chunkEnd}]`;
  };

  const parseChunk = async (chunkNum) => {
    const chunk = getChunk(chunkNum);
    if (!chunk) {
      console.log('Parsing completed');
      return;
    }

    // Build promises collection
    const promises = chunk.map((movieID, index) =>
      makeRequestPromise(movieID, index)
    );

    // Save to db
    try {
      const data = await Promise.all(promises);
      await saveData(...data);

      console.log(`Data chunk ${makeRangeText(chunkNum)} parsed successfully`);
      parseChunk(chunkNum + 1); // Run with the next data chunk
    } catch (error) {
      // console.log(error);
      console.log(
        `Something went wrong when parsing chunk ${makeRangeText(
          chunkNum
        )}. Trying to parse again...`
      );
      setTimeout(() => {
        parseChunk(chunkNum); // Rerun with the same data chunk
      }, 60000);
    }
  };

  return parseChunk(0);
};
