import { google } from 'googleapis';
import { getClient } from '@/libs/get-token';

export const gmail = async () => {
  // const client = await getClient();

  const gmail = google.gmail({
    version: 'v1',
    // auth: client
  });

  const labels = await gmail.users.labels.list({
    userId: 'me',
  });
  console.log('labels : ', labels.data.labels);

  const message = await gmail.users.messages.list({
    userId: 'me',
    q: 'expo',
    maxResults: 5,
  });
  console.log('messages : ', message.data.messages);

  const firstMessage = message.data.messages![3];

  const messageDetail = await gmail.users.messages.get({ userId: 'me', id: firstMessage.id! });

  // @ts-expect-error
  console.info(messageDetail.data.payload?.headers['name']);
  console.info(messageDetail.data.payload?.body?.data);
};
