import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WP_DIR = 'C:\\Users\\YASSIN~1\\AppData\\Local\\Temp\\opencode\\wp-pages';

const SUPABASE_URL = 'https://bgweumxabgkkqnvifaik.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnd2V1bXhhYmdra3FudmlmYWlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDIxNjAxMCwiZXhwIjoyMDk5NzkyMDEwfQ.eQOr4ZxCKn1yRYqzyiotvCQge31PIrpwxuRAn6Iik8I';

function extractGalleryImages(html) {
  const urls = [];

  // Find the togo-st-gallery section — ends either with show-all link or togo-lightbox
  const patterns = [
    /<div class="togo-st-gallery grid layout-01">(.*?)<\/div>\s*<a href="#" class="togo-st-gallery-show-all/s,
    /<div class="togo-st-gallery grid layout-01">(.*?)<\/div>\s*<div class="togo-lightbox /s,
  ];

  let galleryHtml = null;
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      galleryHtml = match[1];
      break;
    }
  }

  if (!galleryHtml) return urls;

  const imgRegex = /<img[^>]*class="lightbox-trigger"[^>]*src="([^"]+)"/g;
  let match;
  while ((match = imgRegex.exec(galleryHtml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function main() {
  const files = readdirSync(WP_DIR).filter(f => f.endsWith('.html'));
  console.log(`Found ${files.length} HTML files\n`);

  const oldData = {};

  for (const file of files) {
    const slug = file.replace(/\.html$/, '');
    const html = readFileSync(join(WP_DIR, file), 'utf-8');
    const images = extractGalleryImages(html);
    oldData[slug] = { file, images };
    console.log(`${slug}: ${images.length} gallery images`);
  }

  console.log('\n--- Fetching current DB state ---\n');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/tours?select=id,slug,image`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) {
    console.error('Failed to fetch tours:', await res.text());
    return;
  }

  const tours = await res.json();
  console.log(`Found ${tours.length} tours in DB\n`);

  let updated = 0;
  let notFound = 0;

  for (const tour of tours) {
    const slug = tour.slug;
    const oldEntry = oldData[slug];

    if (!oldEntry) {
      console.log(`SKIP ${slug}: no HTML file found`);
      notFound++;
      continue;
    }

    const oldImages = oldEntry.images;
    if (oldImages.length === 0) {
      console.log(`SKIP ${slug}: no gallery images extracted from HTML`);
      continue;
    }

    // Parse existing DB images
    let existingImages = [];
    if (tour.image) {
      try {
        existingImages = JSON.parse(tour.image);
        if (!Array.isArray(existingImages)) existingImages = [tour.image];
      } catch {
        existingImages = tour.image ? [tour.image] : [];
      }
    }

    const oldUrlsStr = JSON.stringify([...oldImages].sort());
    const existingUrlsStr = JSON.stringify([...existingImages].sort());

    if (oldUrlsStr === existingUrlsStr) {
      console.log(`OK   ${slug}: ${oldImages.length} images (unchanged)`);
    } else {
      console.log(`UPD  ${slug}: DB=${existingImages.length} → HTML=${oldImages.length} images`);

      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/tours?id=eq.${tour.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ image: JSON.stringify(oldImages) }),
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error(`  FAILED to update ${slug}: ${errText}`);
      } else {
        console.log(`  ✓ Updated successfully`);
        updated++;
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total tours in DB: ${tours.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`No HTML file: ${notFound}`);
}

main().catch(console.error);
