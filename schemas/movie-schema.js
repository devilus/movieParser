import mongoose from 'mongoose';

const { Schema } = mongoose;

export const movieSchema = new Schema(
  {
    _id: Number,
    type: String,
    subtype: String,
    title: String,
    year: Number,
    cast: String,
    director: String,
    genres: Array,
    countries: Array,
    voice: String,
    duration: Object,
    langs: Number,
    quality: Number,
    plot: String,
    tracklist: Array,
    imdb: Number,
    imdb_rating: Number,
    imdb_votes: Number,
    kinopoisk: Number,
    kinopoisk_rating: Number,
    kinopoisk_votes: Number,
    rating: Number,
    rating_votes: Number,
    rating_percentage: Number,
    posters: Object,
    trailer: Object,
    poor_quality: Boolean,
    advert: Boolean,
    created_at: Number,
    updated_at: Number,
    videos: Array,
    seasons: Array,
  },
  { timestamps: true }
);
