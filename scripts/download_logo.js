import fs from 'fs';
import https from 'https';
import path from 'path';

const url = 'https://hcestxaffzsqlkiedvfx.supabase.co/storage/v1/object/public/logo/SAFS-Logo-Retina.png';
const dest = path.resolve('src/assets/logo/original_logo.png');

const file = fs.createWriteStream(dest);
https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      console.log('Logo downloaded successfully to ' + dest);
    });
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error downloading logo:', err.message);
});
