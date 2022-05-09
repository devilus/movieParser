import _ from 'lodash';
import { axiosInstance } from '../../settings/axios.js';
import { stepTimeout } from './step-timeout.js';
import { Movie } from '../../settings/db.js';

const params = {
  sort: '-updated',
  perpage: 100,
};

const getPagesCount = async () => {
  const response = await axiosInstance.get('', { params });
  return response.data.pagination.total;
};

export const parseIDs = async (options = { forceUpdate: false }) => {
  console.log('IDs parsing...');

  const pagesCount = await getPagesCount();
  const pages = _.range(1, pagesCount + 1);

  // Build promises collection
  const promises = pages.map(
    (pageNum) =>
      new Promise((resolve, reject) => {
        stepTimeout(
          async () => {
            const response = await axiosInstance.get('', {
              params: { ...params, page: pageNum },
            });
            const { items } = response.data;
            const movieIDs = items.map((item) => item.id);

            resolve(movieIDs);
            reject(new Error('Parsing error'));
          },
          pageNum,
          { min: 20, max: 50 }
        );
      })
  );

  const movieIDs = await Promise.all(promises)
    .then(_.flatten)
    .catch((error) => console.log(error));

  // Return all
  if (options.forceUpdate) {
    return movieIDs;
  }

  // Return not exists only
  const existMovieIDs = await Movie.find().distinct('_id');
  return movieIDs.filter((movieID) => !existMovieIDs.includes(movieID));
};
