import { google } from 'googleapis';
import { getClient } from './get-token';

export const youtube = async () => {
  const client = await getClient();

  const youtube = google.youtube({ version: 'v3', auth: client });

  const list = await youtube.search.list({
    part: ['id'],
    q: 'react-native',
    maxResults: 5,
  });
  console.log(list.data.items);
};
