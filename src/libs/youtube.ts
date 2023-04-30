import { google } from 'googleapis';
import { getClientAdc } from './get-token';

export const youtube = async () => {
  // const { client } = await getClientAdc();

  const youtube = google.youtube({
    version: 'v3',
    // auth: client
  });

  const list = await youtube.search.list({
    part: ['id'],
    q: 'react-native',
    maxResults: 5,
  });
  console.log(list.data.items);
};
