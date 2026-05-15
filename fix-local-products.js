import fs from 'fs';
import path from 'path';

const PRODUCTS_JSON = path.join(process.cwd(), 'products-safs.json');
const IMAGES_DIR = path.join(process.cwd(), 'src', 'assets', 'safs-images');

const CATEGORY_FOLDERS = {
  'baby-caskets': 'Baby Caskets',
  'bespoke': 'Bespoke',
  'coffins': 'Coffins',
  'domes': 'domes',
  'equipment': 'Equipment',
  'executive-domes': 'Executive Domes',
  'flatlids': 'Flatlids',
  'skinz': 'Skinz'
};

const COLOR_KEYWORDS = [
  'cherry', 'kiaat', 'teak', 'walnut', 'white', 'ash', 'black', 'brown',
  'green', 'hemlock', 'mahogany', 'pecan', 'rose', 'gold', 'red', 'imbuia',
  'redwood', 'purple', 'dark cherry', 'cherry gloss', 'kiaat gloss',
  'uv dotted mahogany', 'redwood gloss', 'rose gold'
];

function findProductImages(categoryFolder, product) {
  const folderPath = path.join(IMAGES_DIR, categoryFolder);
  if (!fs.existsSync(folderPath)) return [];

  const allFiles = fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.includes('-blur.jpg'))
    .sort();

  const productName = product.name.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const matched = [];

  const idParts = product.id.split('-').join(' ');
  for (const file of allFiles) {
    const baseName = path.basename(file, path.extname(file)).toLowerCase();
    if (baseName.includes(idParts) || baseName.includes(productName)) {
      matched.push(`SAFS IMAGES/${categoryFolder}/${file}`);
    }
  }

  return matched;
}

function groupImagesByColor(imageUrls, variants) {
  if (!variants || variants.length === 0) return null;

  const variations = variants.map(color => {
    const colorLower = color.toLowerCase();
    const colorImages = imageUrls.filter(url => {
      const urlLower = url.toLowerCase();
      return urlLower.includes(colorLower.replace(/ /g, '%20')) ||
             urlLower.includes(colorLower.replace(/ /g, '-')) ||
             urlLower.includes(colorLower.replace(/ /g, '_'));
    });

    return {
      color: color,
      images: colorImages.length > 0 ? colorImages : [imageUrls[0] || '']
    };
  });

  return variations.length > 0 ? JSON.stringify(variations) : null;
}

function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
  let updatedCount = 0;

  for (const product of products) {
    const categoryFolder = CATEGORY_FOLDERS[product.category];
    if (!categoryFolder) continue;

    const allImages = findProductImages(categoryFolder, product);
    if (allImages.length === 0) continue;

    const colorVariations = groupImagesByColor(allImages, product.variants);
    
    if (colorVariations) {
      product.colorVariations = colorVariations;
      
      // Also ensure standard 'images' is correct and comprehensive if we found more
      const currentImages = Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []);
      if (allImages.length > currentImages.length) {
         product.images = allImages;
      }
      
      updatedCount++;
    }
  }

  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2));
  console.log(`Updated ${updatedCount} products with colorVariations in products-safs.json`);
}

main();
