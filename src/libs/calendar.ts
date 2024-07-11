import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import moment from 'moment-timezone';

import { google } from 'googleapis';

import { getClient } from './get-token';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export const calendar = async () => {
  // const client = await getClient();
  const gcalendar = google.calendar({
    version: 'v3',
    // auth: client
  });

  const calendarList = await gcalendar.calendarList.list();
  console.info(calendarList);

  const timeMin = dayjs().format();
  console.log(timeMin);
  // const tokyoTimeMin = moment().tz('Asia/Tokyo').toISOString(true);

  const events = await gcalendar.events.list({
    calendarId: 'sgym.snk@gmail.com',
    // orderBy: 'startTime',
    // singleEvents: true,
    timeMin,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  console.info(events.data.items);
};
