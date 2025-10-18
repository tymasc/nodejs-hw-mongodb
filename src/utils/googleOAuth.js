import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';

const client = new OAuth2Client({
  clientId: getEnvVar('GOOGLE_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_REDIRECT_URL'),
});

export function getOAuthURL() {
  return client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  const response = await client.getToken(code);

  return client.verifyIdToken({
    idToken: response.tokens.id_token,
  });
}
