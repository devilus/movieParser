import mongoose from 'mongoose';
import { movieSchema } from '../schemas/movieSchema.js';

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const connection = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;
mongoose.connect(connection);

export const Movie = mongoose.model('Movie', movieSchema);
