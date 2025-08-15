import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import open from 'open';

import { google } from 'googleapis';
import { Credentials, OAuth2Client } from 'google-auth-library';

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve, ServerType } from '@hono/node-server';

import { SCOPES } from '@/constants';

const argv = process.argv;
const isAuto = argv.some((e) => /auto/.test(e));

const port = 3001;
const callbackPath = '/oauth2callback';
const redirectUri = `http://localhost:${port}${callbackPath}`;

const cachePath = path.join(process.cwd(), 'tokens.json');

const getCredentials = () => {
  const credentialsPath = path.join(process.cwd(), 'credentials.json');
  const ctx = readFileSync(credentialsPath, { encoding: 'utf-8' });
  const credentials = JSON.parse(ctx);
  const clientId = credentials['installed'].client_id;
  const clientSecret = credentials['installed'].client_secret;

  return { clientId, clientSecret };
};

const cacheCredentials = (credentials: Credentials) => {
  writeFileSync(cachePath, JSON.stringify(credentials, null, 2), { encoding: 'utf-8' });
};

const loadCachedCredentials = async (client: OAuth2Client) => {
  if (!existsSync(cachePath)) {
    return false;
  }

  const tokens = readFileSync(cachePath, 'utf-8');
  client.setCredentials(JSON.parse(tokens));

  const { token } = await client.getAccessToken();
  if (!token) {
    return false;
  }

  return true;
};

const checkToken = async (token: string) => {
  if (!token) {
    return false;
  }
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
  const data = await response.json();
};

export const getOauthClient = async (forceGenerate: boolean = false) => {
  let server: ServerType | undefined;

  try {
    const { clientId, clientSecret } = getCredentials();
    let client = new google.auth.OAuth2({
      clientId,
      clientSecret,
    });

    client.on('tokens', (tokens) => {
      client.setCredentials(tokens);
      cacheCredentials(tokens);
    });

    if (!forceGenerate && !isAuto && (await loadCachedCredentials(client))) {
      return client;
    }

    // https://github.com/googleapis/google-auth-library-nodejs/blob/main/samples/oauth2-codeVerifier.js
    const codeVerifierResults = await client.generateCodeVerifierAsync();
    const authUrl = client.generateAuthUrl({
      redirect_uri: redirectUri,
      access_type: 'offline',
      scope: SCOPES,
      // @ts-expect-error
      code_challenge_method: 'S256',
      code_challenge: codeVerifierResults.codeChallenge,
    });

    console.log('Please visit the following URL to authorize the application:');
    console.log('');
    console.log(authUrl);
    console.log('');

    const authPromise = new Promise<void>((resolve, reject) => {
      const app = new Hono();
      app.use(logger());

      app.all('/', (c) => {
        return c.text('OAuthリダイレクト 待機中...');
      });

      app.get(callbackPath, async (c) => {
        try {
          const code = c.req.query('code');
          console.log({ code });

          if (code) {
            const { tokens } = await client.getToken({
              code,
              codeVerifier: codeVerifierResults.codeVerifier,
              redirect_uri: redirectUri,
            });
            client.setCredentials(tokens);
            cacheCredentials(tokens);

            resolve();
            // TODO redirect
            return c.text('authenticated');
          }
        } catch (err) {
          console.error('❌️credential error', err);
          reject();
          // TODO redirect
          return c.text('unauthenticated');
        }
      });

      server = serve({
        fetch: app.fetch,
        port,
      });
    });

    // 1.open browser
    const childProcess = await open(authUrl);
    childProcess.on('error', () => {
      console.error('❌️Failed to open browser automatically. Please try running again with NO_BROWSER=true set.');
      process.exit(1);
    });

    // 2.redirect server start & set client credential
    await authPromise;

    return client;
  } catch (err) {
    // reject or refresh token not available
    console.error('❌️An unexpected error', err);
    throw err;
  } finally {
    server?.close();
  }
};

export const getServiceAccount = () => {
  const client = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), 'service_account.json'),
    scopes: SCOPES,
  });

  return client;
};

if (isAuto) {
  console.log('start authenticate');
  getOauthClient()
    .then((client) => {
      if (client) {
        console.log('✔authenticated');
      }

      console.log('end authenticate');
    })
    .finally(() => {
      setTimeout(() => {
        process.exit(0);
      }, 0);
    });
}
