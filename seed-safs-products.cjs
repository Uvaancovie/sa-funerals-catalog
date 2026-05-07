/**
 * SAFS Product Catalog Seeder
 * 
 * Uploads all images from "SAFS IMAGES" to Supabase Storage,
 * then upserts products into the Products table with proper
 * categories, color variations, and multi-angle image grouping.
 * 
 * Usage: node seed-safs-products.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SUPABASE_URL = 'https://hcestxaffzsqlkiedvfx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_KEY or SUPABASE_KEY env var');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IMAGES_DIR = path.join(__dirname, 'src', 'SAFS IMAGES');
const PRODUCTS_JSON = path.join(__dirname, 'products-safs.json');
const BUCKET = 'product-images';

// Category display names
const CATEGORY_NAMES = {
  'baby-caskets': 'Baby Caskets',
  'bespoke': 'Bespoke',
  'coffins': 'Coffins',
  'domes': 'Domes',
  'equipment': 'Equipment',
  'executive-domes': 'Executive Domes',
  'flatlids': 'Flatlids',
  'skinz': 'Skinz'
};

// Map category slug to folder name
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

// Color keywords for matching color variations to images
const COLOR_KEYWORDS = [
  'cherry', 'kiaat', 'teak', 'walnut', 'white', 'ash', 'black', 'brown',
  'green', 'hemlock', 'mahogany', 'pecan', 'rose', 'gold', 'red', 'imbuia',
  'redwood', 'purple', 'dark cherry', 'cherry gloss', 'kiaat gloss',
  'uv dotted mahogany', 'redwood gloss', 'rose gold'
];

async function uploadImage(localPath, storagePath) {
  let fileBuffer;
  try {
    // Compress image with Sharp before uploading
    fileBuffer = await sharp(localPath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (err) {
    console.error(`  ⚠ Compression failed: ${err.message}`);
    fileBuffer = fs.readFileSync(localPath);
  }

  const contentType = 'image/jpeg';

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      cacheControl: '31536000',
      upsert: true,
      contentType
    });

  if (error) {
    console.error(`  ⚠ Upload failed: ${storagePath} - ${error.message}`);
    return null;
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return urlData.publicUrl;
}

/**
 * Find all images in a category folder for a given product
 */
function findProductImages(categoryFolder, product) {
  const folderPath = path.join(IMAGES_DIR, categoryFolder);
  if (!fs.existsSync(folderPath)) return [];

  const allFiles = fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  // If product has explicit "images" array, use those filenames
  if (product.images && product.images.length > 0) {
    return product.images
      .map(imgPath => {
        const fileName = path.basename(imgPath);
        const fullPath = path.join(folderPath, fileName);
        return fs.existsSync(fullPath) ? { fileName, fullPath } : null;
      })
      .filter(Boolean);
  }

  // Otherwise match by product name patterns from the image filename
  const productName = product.name.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const matched = [];

  // Try to find images starting with the product base name
  for (const file of allFiles) {
    const baseName = path.basename(file, path.extname(file)).toLowerCase();
    // Check if file starts with product ID-derived name or product name
    const idParts = product.id.split('-').join(' ');
    if (baseName.includes(idParts) || baseName.includes(productName)) {
      matched.push({ fileName: file, fullPath: path.join(folderPath, file) });
    }
  }

  // Fallback: just use the single image from product.image
  if (matched.length === 0 && product.image) {
    const fileName = path.basename(product.image);
    const fullPath = path.join(folderPath, fileName);
    if (fs.existsSync(fullPath)) {
      matched.push({ fileName, fullPath });
    }
  }

  return matched;
}

/**
 * Group images by color variant for a product
 */
function groupImagesByColor(imageUrls, variants, product) {
  if (!variants || variants.length <= 1) return null;

  const colorVariants = variants.filter(v =>
    COLOR_KEYWORDS.some(k => v.toLowerCase().includes(k)) || v !== 'Standard'
  );

  if (colorVariants.length === 0) return null;

  const variations = colorVariants.map(color => {
    const colorLower = color.toLowerCase();
    // Find images matching this color
    const colorImages = imageUrls.filter(url => {
      const urlLower = url.toLowerCase();
      return urlLower.includes(colorLower.replace(/ /g, '%20')) ||
             urlLower.includes(colorLower.replace(/ /g, '-')) ||
             urlLower.includes(colorLower.replace(/ /g, '_'));
    });

    return {
      Color: color,
      Images: colorImages.length > 0 ? colorImages : [imageUrls[0]]
    };
  });

  return variations.length > 0 ? JSON.stringify(variations) : null;
}

async function main() {
  console.log('🏪 SAFS Product Catalog Seeder');
  console.log('================================\n');

  // Load products JSON
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
  console.log(`📦 Found ${products.length} products to process\n`);

  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET)) {
    console.log(`📁 Creating storage bucket: ${BUCKET}`);
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  let successCount = 0;

  for (const product of products) {
    try {
      console.log(`\n🔄 Processing: ${product.name} (${product.category})`);

      const categoryFolder = CATEGORY_FOLDERS[product.category];
      if (!categoryFolder) {
        console.log(`  ⏭ Unknown category: ${product.category}`);
        continue;
      }

      // Find all local images for this product
      const localImages = findProductImages(categoryFolder, product);
      console.log(`  📷 Found ${localImages.length} local image(s)`);

      // Upload each image to Supabase Storage
      const uploadedUrls = [];
      for (const img of localImages) {
        const storagePath = `safs/${product.category}/${product.id}/${img.fileName.replace(/ /g, '_')}`;
        console.log(`  ⬆️  Uploading: ${img.fileName}`);
        const url = await uploadImage(img.fullPath, storagePath);
        if (url) {
          uploadedUrls.push(url);
          console.log(`  ✅ Uploaded`);
        }
      }

      if (uploadedUrls.length === 0) {
        console.log(`  ⚠ No images uploaded, skipping product`);
        continue;
      }

      // Build color variations
      const colorVariations = groupImagesByColor(uploadedUrls, product.variants, product);

      // Build product record
      const productRecord = {
        Id: product.id,
        Name: product.name,
        Category: product.category,
        Description: `${product.name} - Premium quality from the SA Funeral Supplies collection. Available in ${product.variants.join(', ')}.`,
        Price: product.price > 0 ? product.price : null,
        PriceOnRequest: product.price === 0,
        Images: JSON.stringify(uploadedUrls),
        Features: JSON.stringify(product.variants),
        Specifications: JSON.stringify({
          'Available Variants': product.variants.join(', '),
          'Category': CATEGORY_NAMES[product.category] || product.category,
          'Collection': 'SAFS 2026'
        }),
        ColorVariations: colorVariations,
        InStock: true,
        Featured: false,
        CreatedAt: new Date().toISOString()
      };

      // Upsert into Products table
      const { error } = await supabase
        .from('Products')
        .upsert(productRecord, { onConflict: 'Id' });

      if (error) {
        console.log(`  ❌ DB error: ${error.message}`);
      } else {
        console.log(`  ✅ Saved to database`);
        successCount++;
      }

    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }

  console.log(`\n================================`);
  console.log(`✅ Successfully processed ${successCount}/${products.length} products`);
  console.log(`\nCategories seeded:`);
  Object.entries(CATEGORY_NAMES).forEach(([slug, name]) => {
    const count = products.filter(p => p.category === slug).length;
    console.log(`  ${name}: ${count} products`);
  });
}

main().catch(console.error);
