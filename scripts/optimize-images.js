import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [400, 800, 1200, 1600];
const FORMATS = ['webp', 'avif'];
const QUALITY = { webp: 85, avif: 80 };
const INPUT_DIR = path.join(__dirname, '../src/SAFS IMAGES');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/safs-images');

async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const relativePath = path.relative(INPUT_DIR, path.dirname(inputPath));
  const outputSubDir = path.join(outputDir, relativePath);

  await ensureDir(outputSubDir);

  const results = [];

  for (const size of SIZES) {
    for (const format of FORMATS) {
      const outputPath = path.join(outputSubDir, `${filename}-${size}w.${format}`);

      try {
        await sharp(inputPath)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside',
            position: 'center'
          })
          [format]({
            quality: QUALITY[format],
            effort: 6,
            lossless: false
          })
          .toFile(outputPath);

        results.push({
          original: inputPath,
          output: outputPath,
          size: size,
          format: format
        });

        console.log(`✓ Generated: ${outputPath}`);
      } catch (error) {
        console.error(`✗ Failed to generate ${outputPath}:`, error.message);
      }
    }
  }

  // Generate blur placeholder
  const blurPath = path.join(outputSubDir, `${filename}-blur.jpg`);
  try {
    await sharp(inputPath)
      .resize(20, 20, { fit: 'inside' })
      .blur(1)
      .jpeg({ quality: 60 })
      .toFile(blurPath);

    results.push({
      original: inputPath,
      output: blurPath,
      type: 'blur'
    });

    console.log(`✓ Generated blur placeholder: ${blurPath}`);
  } catch (error) {
    console.error(`✗ Failed to generate blur placeholder for ${filename}:`, error.message);
  }

  return results;
}

async function processDirectory(dirPath, outputDir) {
  console.log(`Processing directory: ${dirPath}`);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  console.log(`Found ${entries.length} entries in ${dirPath}`);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      console.log(`Entering directory: ${fullPath}`);
      await processDirectory(fullPath, outputDir);
    } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
      console.log(`\n📸 Processing: ${fullPath}`);
      await optimizeImage(fullPath, outputDir);
    } else {
      console.log(`Skipping: ${fullPath} (not a JPG/PNG file)`);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting image optimization process...\n');
    console.log(`Input directory: ${INPUT_DIR}`);
    console.log(`Output directory: ${OUTPUT_DIR}\n`);

    await ensureDir(OUTPUT_DIR);
    await processDirectory(INPUT_DIR, OUTPUT_DIR);

    console.log('\n✅ Image optimization completed!');
    console.log(`📁 Optimized images saved to: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run main if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { optimizeImage, processDirectory };