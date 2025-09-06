import { Creem } from 'creem';

if (!process.env.CREEM_SECRET_KEY) {
  throw new Error('CREEM_SECRET_KEY is not set in the environment variables.');
}

// Initialize the Creem SDK with the secret key
// The 'apiVersion' is recommended by Creem to ensure your integration doesn't break with future updates.
// Determine the server URL based on the environment
const serverURL = process.env.NODE_ENV === 'development'
  ? 'https://test-api.creem.io'
  : 'https://api.creem.io';

// Initialize the Creem SDK with the appropriate server URL
export const creem = new Creem({ serverURL });

// Create a configuration object that includes the API key.
// This can be imported and spread into API calls across the application.
export const creemConfig = {
  xApiKey: process.env.CREEM_SECRET_KEY!,
};