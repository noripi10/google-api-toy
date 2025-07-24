import fs from 'node:fs/promises';
import path from 'node:path';

import { google } from 'googleapis';
import { CredentialProps } from '@/@types/credential';
import { SCOPES } from '@/constants';
import { generateToken } from './gen-token';

export const getClientFromJson = async () => {
  // OAuth Client(Desktop)をGCPで作成してJSONダウンロード
  // JSONファイル内の記載されているclient_id, client_secret
  const contents = await fs.readFile(path.join(process.cwd(), 'credentials.json'), 'utf-8');
  const credentials = JSON.parse(contents) as CredentialProps;
  const installed = credentials['installed'];
  const clientId = installed['client_id'];
  const clientSecret = installed['client_secret'];
  // Redirect先は固定値
  const redirectUrl = credentials.installed.redirect_uris[0];
  // const redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';

  return { clientId, clientSecret, redirectUrl };
};

type GetRefreshToken = ReturnType<typeof getRefreshToken>;

export const getRefreshToken = async (isReCall?: boolean): Promise<{ refreshToken: string | null }> => {
  try {
    const contentsToken = await fs.readFile(path.join(process.cwd(), 'tokens.json'), 'utf-8');
    const token = JSON.parse(contentsToken);
    const accessToken = token['access_token'];
    let refreshToken = token['refresh_token'];

    const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`;
    const result = await fetch(url);
    const data = await result.json();

    if (!('expires_in' in data)) {
      console.info('** Access Token Expired **');
      // refreshToken = null;
    }
    return { refreshToken };
  } catch {
    return { refreshToken: null };
  }
};

// 各APIのauthに渡すOAuth Client
export const getClient = async () => {
  const { clientId, clientSecret, redirectUrl } = await getClientFromJson();
  const { refreshToken } = await getRefreshToken();

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

  if (!refreshToken) {
    throw new Error('** Refresh Token Invalid. Required Generate Token. **');
  }

  // https://developers.google.com/identity/protocols/oauth2/web-server?hl=ja#offline
  client.on('tokens', (tokens) => {
    console.info('tokens reflesh: ', tokens);
    client.setCredentials({ refresh_token: tokens.refresh_token });
  });

  client.setCredentials({
    refresh_token: refreshToken,
  });
  await client.refreshAccessToken();

  const result = await client.getAccessToken();
  console.log({ result });

  return client;
};

// ADCによる認証
export const getClientAdc = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile: path.join(process.cwd(), 'service_account.json'),
  });

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  // console.info({ client, projectId });

  return { client, projectId };
};
