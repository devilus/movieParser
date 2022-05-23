import _ from 'lodash';
import { axiosClient } from '../../settings/axios.js';
import { stepTimeout } from './step-timeout.js';
import { Movie } from '../../settings/db.js';

const params = {
  sort: '-updated',
  perpage: 100,
};

const getPagesCount = async () => {
  const response = await axiosClient.get('', { params });
  return response.data.pagination.total;
};

const makeRequestPromise = (pageNum) =>
  new Promise((resolve, reject) => {
    stepTimeout(
      () => {
        axiosClient
          .get('', {
            params: { ...params, page: pageNum },
          })
          .then((response) => {
            const { items } = response.data;
            const movieIDs = items.map((item) => item.id);
            resolve(movieIDs);
          })
          .catch(() => {
            reject(new Error('Parsing error'));
          });
      },
      pageNum,
      { min: 20, max: 50 }
    );
  });

export const parseIDs = async (options = { forceUpdate: false }) => {
  const pagesCount = await getPagesCount();
  const pages = _.range(1, pagesCount + 1);

  // Build promises collection
  const promises = pages.map((pageNum) => makeRequestPromise(pageNum));

  const movieIDs = await Promise.all(promises).then(_.flatten);

  // Return all
  if (options.forceUpdate) {
    return movieIDs;
  }

  // Return not exists only
  const existMovieIDs = await Movie.find().distinct('_id');
  return movieIDs.filter((movieID) => !existMovieIDs.includes(movieID));
};
