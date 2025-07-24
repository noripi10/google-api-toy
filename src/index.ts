import { google } from 'googleapis';

// import { getClient, getClientAdc } from '@/libs/get-token';
import { getOauthClient } from '@/libs/oauth';

import { compute } from '@/libs/compute';
import { youtube } from '@/libs/youtube';
import { gmail } from '@/libs/gmail';
import { calendar } from '@/libs/calendar';
import { sheets } from '@/libs/sheets';
import { text2Speetch } from '@/libs/text2speech';

const main = async () => {
  console.log('🚀start index.ts');

  const client = await getOauthClient();
  google.options({ auth: client });

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
};

main();
