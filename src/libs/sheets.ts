import { google } from 'googleapis';
import { getClientAdc } from './get-token';

export const sheets = async () => {
  // const { client } = await getClientAdc();

  const sheets = google.sheets({ version: 'v4' });

  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: '10Tx5UJNjRH5BXfdxJfEvBqwFEjZDrsJ14QJOPN7lC1w',
    range: 'シート1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        ['Justin', '1/1/2001', 'Website'],
        ['Node.js', '2018-03-14', 'Fun'],
      ],
    },
  });

  console.info({ res });
};
