import { createRequire } from 'module';
import https from 'https';
import { Readable } from 'stream';

const require = createRequire(import.meta.url);
const cloudinary = require('cloudinary').v2;

const SUPABASE_URL = 'https://bgweumxabgkkqnvifaik.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I';

cloudinary.config({
  cloud_name: 'sx85slkf',
  api_key: '363668523468917',
  api_secret: 'jh3tBRIaVSZTIrxTT1hnal9sXcU',
});

const CLOUDINARY_FOLDER = 'hurghada-reiseplaner/tours';

function supabaseGet(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'bgweumxabgkkqnvifaik.supabase.co',
      path: '/rest/v1/' + path,
      method: 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY,
      },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`Supabase GET ${path} ${res.statusCode}: ${body}`));
        resolve(JSON.parse(body));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function supabasePatch(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const opts = {
      hostname: 'bgweumxabgkkqnvifaik.supabase.co',
      path: '/rest/v1/' + path,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY,
        Prefer: 'return=minimal',
      },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`Supabase PATCH ${path} ${res.statusCode}: ${body}`));
        resolve();
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 400) return reject(new Error(`Download ${url}: ${res.statusCode}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        resource_type: 'image',
        transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload returned no result'));
        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

function parseImages(imageField) {
  if (!imageField) return [];
  try {
    const parsed = JSON.parse(imageField);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return typeof imageField === 'string' && imageField.startsWith('http') ? [imageField] : [];
  }
}

function isCloudinaryUrl(url) {
  return url.includes('res.cloudinary.com');
}

function isWpUrl(url) {
  return url.includes('hurghada-reiseplaner.at');
}

function urlToPublicId(url) {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const name = filename.replace(/\.[^.]+$/, '');
  const safe = name
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 100);
  return safe || 'image';
}

async function processTour(tour) {
  const images = parseImages(tour.image);
  if (!images.length) return { slug: tour.slug, status: 'skipped', reason: 'no images' };

  const wpUrls = images.filter((u) => isWpUrl(u));
  if (!wpUrls.length) return { slug: tour.slug, status: 'skipped', reason: 'already cloudinary' };

  const newImages = [...images];
  const results = [];

  for (let i = 0; i < newImages.length; i++) {
    const url = newImages[i];
    if (!isWpUrl(url)) continue;

    const publicId = urlToPublicId(url);

    try {
      console.log(`  [${tour.slug}] Downloading: ${url.substring(0, 80)}...`);
      const buffer = await downloadImage(url);
      console.log(`  [${tour.slug}] Uploading to cloudinary...`);
      const cloudinaryUrl = await uploadToCloudinary(buffer, publicId);
      newImages[i] = cloudinaryUrl;
      results.push({ old: url, new: cloudinaryUrl, status: 'ok' });
      console.log(`  [${tour.slug}] OK -> ${cloudinaryUrl}`);
    } catch (err) {
      results.push({ old: url, status: 'failed', error: err.message });
      console.error(`  [${tour.slug}] FAILED: ${err.message}`);
    }
  }

  const updatedImages = newImages.filter((u) => isCloudinaryUrl(u));

  try {
    await supabasePatch(`tours?slug=eq.${encodeURIComponent(tour.slug)}`, {
      image: JSON.stringify(updatedImages),
    });
    console.log(`  [${tour.slug}] DB updated with ${updatedImages.length} Cloudinary URLs`);
    return { slug: tour.slug, status: 'done', total: images.length, uploaded: results.filter((r) => r.status === 'ok').length, failed: results.filter((r) => r.status === 'failed').length };
  } catch (err) {
    return { slug: tour.slug, status: 'db_error', error: err.message };
  }
}

async function main() {
  console.log('Fetching all tours from Supabase...');
  const tours = await supabaseGet('tours?select=slug,image');
  console.log(`Found ${tours.length} tours`);

  const toursWithWp = tours.filter((t) => parseImages(t.image).some((u) => isWpUrl(u)));
  console.log(`${toursWithWp.length} tours have WordPress images to migrate\n`);

  let done = 0;
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const tour of toursWithWp) {
    done++;
    console.log(`[${done}/${toursWithWp.length}] ${tour.slug}`);
    const result = await processTour(tour);
    if (result.uploaded) totalUploaded += result.uploaded;
    if (result.failed) totalFailed += result.failed;
    console.log('');
  }

  console.log('=== Migration Complete ===');
  console.log(`Tours processed: ${done}`);
  console.log(`Images uploaded: ${totalUploaded}`);
  console.log(`Images failed: ${totalFailed}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
