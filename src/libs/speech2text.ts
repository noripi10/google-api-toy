import { GoogleCLientWithAuth } from '@/@types/credential';
import { google, speech_v1 } from 'googleapis';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const speetch2TextLocal = async () => {
  const client = google.speech({ version: 'v1' });

  const filename = path.join(process.cwd(), 'output.mp3'); // 例: 'input.wav'
  const encoding: any = 'MP3'; // 例: 'LINEAR16' or 'FLAC'
  const sampleRateHertz = 16000;
  const languageCode = 'ja-JP';
  const audioBytes = readFileSync(filename).toString('base64');

  const request: speech_v1.Params$Resource$Speech$Recognize = {
    requestBody: {
      config: {
        encoding,
        sampleRateHertz,
        languageCode,
      },
      audio: {
        content: audioBytes,
      },
    },
  };

  // 同期認識（音声が短い場合のみ推奨）
  const response = await client.speech.recognize(request);
  const transcription = response.data.results?.map((result: any) => result.alternatives[0].transcript).join('\n');
  console.log('Transcription:', transcription);

  // ストリーミング認識をgoogleapisのみで行いたい場合は、@google-cloud/speechの利用が推奨されます。
};
