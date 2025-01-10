import { configDotenv } from "dotenv";

configDotenv();

const serverPort = process.env.PORT || 8000;
const mongodbUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpires = process.env.JWT_EXPIRES;

const emailAddress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASS;
const toEmail = process.env.TO_EMAIL;

const stripSecret = process.env.STRIPE_SECRET_KEY;
const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalCleintSecret = process.env.PAYPAL_CLIENT_SECRET;

export {
  serverPort,
  mongodbUri,
  jwtSecret,
  jwtExpires,
  emailAddress,
  emailPassword,
  toEmail,
  stripSecret,
  paypalClientId,
  paypalCleintSecret,
};
