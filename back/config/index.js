import dotenv from "dotenv";
dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
};
