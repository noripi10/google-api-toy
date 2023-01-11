import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import glob from 'glob';
import crypto from 'crypto-js';

const main = async () => {
  console.log('main');

  console.log('argv', process.argv);

  console.log(os.platform());

  const hoge = '1';
  console.log(('0' + hoge).slice(-2));

  const stat = await fs.stat(path.join(process.cwd(), 'src', 'index.ts'));
  // console.log(stat.isDirectory(), stat.isFile());

  // console.log(path.join(process.cwd(), 'public') + '**\\*.txt');

  const files = glob.sync('./public/**/*.txt', { nodir: true, ignore: ['node_modules/**'] });
  // console.log({ files });

  const infos = await Promise.all(
    files.map(async (file) => {
      const info = await fs.stat(file);
      return info;
    })
  );

  for (let info of infos) {
    console.log(info.isFile());
  }

  const bytes = crypto.AES.decrypt('aes_code', 'secret_key');
  const rawText = bytes.toString(crypto.enc.Utf8);
  console.log({ rawText });
};

main();
