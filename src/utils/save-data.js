import { Movie } from '../../settings/db.js';

export const saveData = async (...movies) => {
  const bulkData = movies.map((movie) => ({
    updateOne: {
      filter: { _id: movie.id },
      update: { ...movie, _id: movie.id },
      upsert: true,
    },
  }));

  Movie.bulkWrite(bulkData);
};
