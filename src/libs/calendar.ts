import { google } from 'googleapis';
import { getClient } from './get-token';

export const calendar = async () => {
  const client = await getClient();

  const gcalendar = google.calendar({ version: 'v3', auth: client });

  const list = await gcalendar.calendarList.get({ calendarId: 'sgym.snk@gmail.com' });
  console.info(list);

  const events = await gcalendar.events.list({
    calendarId: 'sgym.snk@gmail.com',
    maxResults: 5,
  });
  console.info(events.data.items);
};
