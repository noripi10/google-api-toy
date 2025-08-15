import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

// import { getClient, getClientAdc } from '@/libs/get-token';
import { getOauthClient, getServiceAccount } from '@/libs/oauth';

import { compute } from '@/libs/compute';
import { youtube } from '@/libs/youtube';
import { gmail } from '@/libs/gmail';
import { calendar } from '@/libs/calendar';
import { sheets } from '@/libs/sheets';
import { text2Speetch } from '@/libs/text2speech';
import { speetch2TextLocal } from '@/libs/speech2text';

const main = async () => {
  console.log('🚀start index.ts');

  // ※認証１ (OAuth)
  let client: OAuth2Client | undefined;
  try {
    client = await getOauthClient();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('No refresh token or refresh handler callback is set')) {
        client = await getOauthClient(true);
      }
    }
  } finally {
    if (client) {
      google.options({ auth: client });
    }
  }
  // ※認証２ (ServiceAccount)
  // const client = getServiceAccount();
  // google.options({ auth: client });

  // ※API利用
  // #compute
  // await compute();

  // #youtube api
  // await youtube();

  // #gmail api
  // await gmail();

  // #calendar api
  // await calendar();

  // # sheets api
  // await sheets();

  // #text2speech api
  // await text2Speetch();

  // #speetch2Text api
  // await speetch2TextLocal();
};

main();
