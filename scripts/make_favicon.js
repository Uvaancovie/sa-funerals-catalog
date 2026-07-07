import sharp from 'sharp';
import path from 'path';

async function generateFavicon() {
  const originalPath = path.resolve('src/assets/logo/original_logo.png');
  const outputPath = path.resolve('src/assets/logo/favicon.png');

  try {
    const size = 64;
    const padding = 8;
    const logoSize = size - (padding * 2); // 48x48

    // Get metadata of original logo
    const metadata = await sharp(originalPath).metadata();
    console.log('Original logo metadata:', metadata.width, 'x', metadata.height);

    // Resize the logo to fit within the inner area (logoSize x logoSize)
    const resizedLogoBuffer = await sharp(originalPath)
      .resize({
        width: logoSize,
        height: logoSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent background for the resized logo
      })
      .toBuffer();

    // Create a solid blue (#151A40) background canvas
    // #151A40 in RGB is: R=21, G=26, B=64
    const favicon = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 21, g: 26, b: 64, alpha: 1 }
      }
    })
    .composite([{
      input: resizedLogoBuffer,
      gravity: 'center'
    }])
    .png()
    .toFile(outputPath);

    console.log('Favicon generated successfully at:', outputPath);
  } catch (err) {
    console.error('Error generating favicon:', err);
  }
}

generateFavicon();
