import { google } from 'googleapis';
import { getClient } from './get-token';

export const compute = async () => {
  // const client = await getClient();

  const compute = google.compute('v1');
  const res = await compute.zones.list({
    project: 'practiceapp-567a6',
    // auth: client,
  });

  console.log({ res });
};
