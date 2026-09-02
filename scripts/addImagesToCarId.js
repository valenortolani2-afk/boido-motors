const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'imagenes de los autos');
const CARS_FILE = path.join(process.cwd(), 'app', 'cars.ts');
const TARGET_ID = 6;

function encodeSegment(segment) {
  return encodeURIComponent(segment).replace(/%20/g, '%20');
}

function getImagesForFolder(folderName) {
  const folderPath = path.join(PUBLIC_DIR, folderName);
  if (!fs.existsSync(folderPath)) return [];
  return fs.readdirSync(folderPath).filter((f) => /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(f)).map((f) => `/imagenes%20de%20los%20autos/${encodeSegment(folderName)}/${encodeSegment(f)}`);
}

function findFolderNameForId(carsText, id) {
  const idx = carsText.indexOf(`id: ${id}`);
  if (idx === -1) return null;
  const titleMatch = carsText.slice(idx, idx + 400).match(/title:\s*"([^"]+)"/);
  if (!titleMatch) return null;
  const title = titleMatch[1];
  let folder = title.toLowerCase();
  folder = folder.replace(/[^a-z0-9\s]/gi, ' ');
  folder = folder.replace(/\s+/g, ' ').trim();
  // return an array of candidate folder names (most specific first)
  const parts = folder.split(' ');
  const candidates = [];
  candidates.push(folder);
  if (parts.length >= 2) candidates.push(parts.slice(0, 2).join(' '));
  if (parts.length >= 1) candidates.push(parts[0]);
  // also add a common simple fallback
  candidates.push('volkswagen up');
  return candidates;
}

function replaceObjectForId(carsText, id, newImage, newImages) {
  const idIdx = carsText.indexOf(`id: ${id}`);
  if (idIdx === -1) throw new Error('id not found');

  // find start of object: search backwards for the previous '{'
  let start = idIdx;
  while (start >= 0 && carsText[start] !== '{') start--;
  if (start < 0) throw new Error('object start not found');

  // find end of object by matching braces
  let i = start;
  let depth = 0;
  let end = -1;
  for (; i < carsText.length; i++) {
    if (carsText[i] === '{') depth++;
    else if (carsText[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('object end not found');

  const objectText = carsText.slice(start, end + 1);

  // build replacement object: keep id and title by extracting them
  const titleMatch = objectText.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : '';
  const yearMatch = objectText.match(/year:\s*"([^"]*)"/);
  const year = yearMatch ? yearMatch[1] : '';
  const priceMatch = objectText.match(/price:\s*"([^"]*)"/);
  const price = priceMatch ? priceMatch[1] : '';
  const badgeMatch = objectText.match(/badge:\s*"([^"]*)"/);
  const badge = badgeMatch ? badgeMatch[1] : '';
  const kmMatch = objectText.match(/km:\s*"([^"]*)"/);
  const km = kmMatch ? kmMatch[1] : '';
  const fuelMatch = objectText.match(/fuel:\s*"([^"]*)"/);
  const fuel = fuelMatch ? fuelMatch[1] : '';
  const transmissionMatch = objectText.match(/transmission:\s*"([^"]*)"/);
  const transmission = transmissionMatch ? transmissionMatch[1] : '';
  const descriptionMatch = objectText.match(/description:\s*`([^`]*)`|description:\s*"([\s\S]*?)"\s*,?\n/);
  const description = descriptionMatch ? (descriptionMatch[1] || descriptionMatch[2] || '') : '';

  const imagesArrayText = newImages.map((img) => `"${img}"`).join(',\n      ');

  const replacement = `{
    id: ${id},
    title: "${title}",
    year: "${year}",
    price: "${price}",
    image: "${newImage}",
    images: [
      ${imagesArrayText}
    ],
    badge: "${badge}",
    km: "${km}",
    fuel: "${fuel}",
    transmission: "${transmission}",
    description: "${description}",
  }`;

  const newText = carsText.slice(0, start) + replacement + carsText.slice(end + 1);
  return newText;
}

function main() {
  if (!fs.existsSync(CARS_FILE)) {
    console.error('Cannot find', CARS_FILE);
    process.exit(1);
  }

  const carsText = fs.readFileSync(CARS_FILE, 'utf8');
  let folderCandidates = findFolderNameForId(carsText, TARGET_ID) || ['volkswagen up'];
  if (!Array.isArray(folderCandidates)) folderCandidates = [folderCandidates];
  console.log('Folder candidates:', folderCandidates);

  let images = [];
  let chosenFolder = null;
  for (const cand of folderCandidates) {
    const imgs = getImagesForFolder(cand);
    if (imgs.length > 0) {
      images = imgs;
      chosenFolder = cand;
      break;
    }
  }

  if (images.length === 0) {
    // fallback: scan root public images folder for files that reference the model (e.g., 'up' or 'volkswagen')
    const rootFiles = fs.readdirSync(PUBLIC_DIR).filter((f) => /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(f));
    const matching = rootFiles.filter((f) => /up|volkswagen/i.test(f));
    if (matching.length === 0) {
      console.error('No images found for candidates', folderCandidates);
      process.exit(1);
    }

    images = matching.map((f) => `/imagenes%20de%20los%20autos/${encodeSegment(f)}`);
    console.log('Using fallback files from public folder:', matching);
  }
  console.log('Using folder:', chosenFolder);

  const newImage = images[0];

  const newCarsText = replaceObjectForId(carsText, TARGET_ID, newImage, images);
  fs.writeFileSync(CARS_FILE, newCarsText, 'utf8');
  console.log('Updated', CARS_FILE, 'with', images.length, 'images for id', TARGET_ID);
}

main();
