import { google } from 'googleapis';

import { getClient } from '@/libs/get-token';
import { compute } from '@/libs/compute';
import { youtube } from '@/libs/youtube';
import { gmail } from '@/libs/gmail';
import { calendar } from '@/libs/calendar';
import { sheets } from './libs/sheets';

const main = async () => {
  console.log('start index.ts');
  const client = await getClient();
  google.options({ auth: client });

  // #compute
  // await compute();

  // // #youtube api
  // await youtube();

  // // #gmail api
  // await gmail();

  // // #google calendar api
  // await calendar();

  // // # sheets api
  // await sheets();
};

main();
