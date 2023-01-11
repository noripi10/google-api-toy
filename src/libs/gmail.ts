import { google } from 'googleapis';
import { getClient } from '@/libs/get-token';

export const gmail = async () => {
  const client = await getClient();

  const gmail = google.gmail({ version: 'v1', auth: client });

  const labels = await gmail.users.labels.list({
    userId: 'me',
  });
  console.log(labels.data.labels);

  const message = await gmail.users.messages.list({
    userId: 'me',
    q: 'expo',
    maxResults: 5,
  });
  console.log(message.data.messages);
};
