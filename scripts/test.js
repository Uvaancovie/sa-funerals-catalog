console.log('Test script starting...');
console.log('Current directory:', process.cwd());

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__dirname:', __dirname);

const INPUT_DIR = path.join(__dirname, '../src/SAFS IMAGES');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/safs-images');

console.log('Input dir:', INPUT_DIR);
console.log('Output dir:', OUTPUT_DIR);

try {
  const stats = await fs.stat(INPUT_DIR);
  console.log('Input dir exists:', stats.isDirectory());
} catch (error) {
  console.error('Input dir error:', error.message);
}

console.log('Test script completed');