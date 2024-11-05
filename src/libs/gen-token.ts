import path from 'path';
import fs from 'node:fs/promises';
import readline from 'readline';
import { exec } from 'child_process';

import { google } from 'googleapis';
import { getClientFromJson } from '@/libs/get-token';
import { SCOPES } from '@/constants';

export const generateToken = async () => {
  const { clientId, clientSecret, redirectUrl } = await getClientFromJson();

  const redirectUrlWithPort = `${redirectUrl}:3000`;

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUrlWithPort);

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    include_granted_scopes: true,
  });
  console.log({ url });

  exec(`open "${url}"`);

  // 画面から取得したコード貼り付けてトークン発行
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Copy code :', (code: string) => {
    // console.log({ code });
    client.getToken(code, async (err, tokens) => {
      console.log(err, tokens);
      if (!err && tokens) {
        const savePath = path.join(process.cwd(), 'tokens.json');
        try {
          if (await fs.stat(savePath)) {
            await fs.rm(savePath);
          }
        } catch {}
        await fs.writeFile(savePath, JSON.stringify(tokens, null, 2), 'utf-8');
        console.log(`${savePath}へTokenを保存しました`);
      } else console.error('トークンの発行に失敗しました');

      process.exit(0);
    });
  });
};

generateToken();
