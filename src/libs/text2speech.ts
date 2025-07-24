import { google } from 'googleapis';
import { writeFile, writeFileSync } from 'node:fs';
import path from 'node:path';

export const text2Speetch = async () => {
  const ttf = google.texttospeech({ version: 'v1' });

  // 対応音声リスト [名前, 性別, 言語コード, レート][]
  // const result = await ttf.voices.list({ languageCode: 'ja-JP' });
  // const voiceList = result.data.voices?.map((e) => {
  //   return `${e.name} ${e.ssmlGender} ${e.languageCodes} ${e.naturalSampleRateHertz}`;
  // });
  // console.log('voiceList', voiceList);

  const result = await ttf.text.synthesize({
    requestBody: {
      input: {
        text: 'こんにちわ。これはgoogleapisを使って、テキストデータを音声データを生成するプログラムです。',
      },
      voice: {
        // name: 'ja-JP-Chirp3-HD-Achernar',
        languageCode: 'ja-JP',
        ssmlGender: 'FEMALE',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
      },
    },
  });

  const base64 = result.data.audioContent ?? '';
  const buffer = Buffer.from(base64, 'base64');
  const filePath = path.join(process.cwd(), 'output.mp3');
  writeFileSync(filePath, buffer, 'binary');
};
