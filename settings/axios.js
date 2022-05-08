import axios from 'axios';
import 'dotenv/config';

const headers = {
  Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  'User-Agent': process.env.USER_AGENT,
  'Accept-Language': 'ru-RU;q=1.0, en-RU;q=0.9',
  'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
  Accept: '*/*',
};

export const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  headers,
});
