import _ from 'lodash';
import { axiosInstance } from '../../settings/axios.js';
import { stepTimeout } from './stepTimeout.js';
import { saveData } from './saveData.js';

export const parseData = (...movieIDs) => {
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
    await Promise.all(promises)
      .then((result) => {
        saveData(...result).then(() => {
          console.log(`Parsed data chunk: ${makeRangeString(chunkNum)}`);
          parseChunk(chunkNum + 1); // Run with the next data chunk
        });
      })
      .catch((error) => {
        console.log(error);

        const waitSeconds = 60;
        setTimeout(() => {
          parseChunk(chunkNum); // Rerun with the same data chunk
        }, waitSeconds * 1000);
      });
  };

  parseChunk(0);
};
