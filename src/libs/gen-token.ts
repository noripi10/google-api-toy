import path from 'path';
import fs from 'node:fs/promises';
import readline from 'readline';

import { google } from 'googleapis';
import { getClientFromJson } from '@/libs/get-token';

export const generateToken = async () => {
  const { clientId, clientSecret, redirectUrl } = await getClientFromJson();

  // ※Scopeを変更したらトークン再発行必要
  const SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/calendar',
  ];

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log({ url });

  // 画面から取得したコード貼り付けてトークン発行
  rl.question('Copy code : ', (code: string) => {
    // console.log({ code });
    client.getToken(code, (err, tokens) => {
      if (!err && tokens) {
        const savePath = path.join(process.cwd(), 'tokens.json');
        fs.writeFile(savePath, JSON.stringify(tokens, null, 2), 'utf-8');
        console.log(`${savePath}へTokenを保存しました`);
      } else console.error('トークンの発行に失敗しました');
    });
  });
};

generateToken();
