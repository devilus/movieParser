import mongoose from 'mongoose';
import { movieSchema } from '../schemas/movie-schema.js';

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } = process.env;

const connection = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose.connect(connection);

export const Movie = mongoose.model('Movie', movieSchema);
