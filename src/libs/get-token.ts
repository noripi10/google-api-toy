import fs from 'node:fs/promises';
import path from 'node:path';

import { google } from 'googleapis';
import { CredentialProps } from '@/@types/credential';

// 参考文献
// https://qiita.com/kompiro/items/8e4c4d79cbbb5a3c95f6
// Google API Node.js List
// https://googleapis.dev/nodejs/googleapis/latest/
// Scope List
// https://developers.google.com/identity/protocols/oauth2/scopes

export const getClientFromJson = async () => {
  // OAuth Client(Desktop)をGCPで作成してJSONダウンロード
  // JSONファイル内の記載されているclient_id, client_secret
  const contents = await fs.readFile(path.join(process.cwd(), 'credentials.json'), 'utf-8');
  const credentials = JSON.parse(contents) as CredentialProps;
  const installed = credentials['installed'];
  const clientId = installed['client_id'];
  const clientSecret = installed['client_secret'];
  // Redirect先は固定値
  const redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';

  return { clientId, clientSecret, redirectUrl };
};

export const getRefreshToken = async () => {
  const contentsToken = await fs.readFile(path.join(process.cwd(), 'tokens.json'), 'utf-8');
  const token = JSON.parse(contentsToken);
  const refreshToken = token['refresh_token'];

  return { refreshToken };
};

// 各APIのauthに渡すOAuth Client
export const getClient = async () => {
  const { clientId, clientSecret, redirectUrl } = await getClientFromJson();
  const { refreshToken } = await getRefreshToken();

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
  client.setCredentials({
    refresh_token: refreshToken,
  });
  await client.refreshAccessToken();

  return client;
};
