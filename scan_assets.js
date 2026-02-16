import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src/assets');
const products = [];

const dirs = fs.readdirSync(assetsDir, { withFileTypes: true });

for (const dirent of dirs) {
    if (dirent.isDirectory()) {
        const productDir = path.join(assetsDir, dirent.name);
        const files = fs.readdirSync(productDir);
        const imageFile = files.find(f => f.match(/\.(png|jpg|jpeg)$/i));

        if (imageFile) {
            let category = 'casket';
            const lowName = dirent.name.toLowerCase();

            if (
                ['church-trolley', 'coffin-stand', 'fibre-glass-wash-table',
                    'grass-matts', 'high-stand', 'lowering-device',
                    'maroon-tent', 'south-african-stretcher', 'body-box',
                    'casket-racking-system'].includes(lowName)
            ) {
                category = 'accessory';
            } else if (lowName.includes('4-ft') || lowName.includes('5-ft')) {
                category = 'child';
            }

            const name = dirent.name.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Try to extract variants from the filename if possible, e.g., '1-cherry-teak-kiaat.png' -> ['Cherry', 'Teak', 'Kiaat']
            let variants = ['Standard'];
            const variantMatch = imageFile.match(/^1-(.+)\./);
            if (variantMatch) {
                variants = variantMatch[1].split('-').map(v => v.charAt(0).toUpperCase() + v.slice(1));
            }

            products.push({
                id: dirent.name,
                name: name,
                category: category,
                image: `assets/${dirent.name}/${imageFile}`,
                variants: variants,
                price: 0 // Placeholder
            });
        }
    }
}

fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2));
console.log('Done writing products.json');
