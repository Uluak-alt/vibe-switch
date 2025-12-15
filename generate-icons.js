// generate-icons.js - Create extension icons
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG icon template
function createSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <g transform="translate(${size * 0.2}, ${size * 0.2})">
    <polyline points="${size * 0.48},${size * 0.12} ${size * 0.6},${size * 0.3} ${size * 0.48},${size * 0.48}" 
              stroke="white" stroke-width="${size * 0.08}" fill="none" 
              stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="${size * 0.12},${size * 0.12} ${size * 0},${size * 0.3} ${size * 0.12},${size * 0.48}" 
              stroke="white" stroke-width="${size * 0.08}" fill="none" 
              stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'extension', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG files for each size
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const svg = createSVG(size);
  const filename = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Created ${filename}`);
});

console.log('\n📦 SVG icons created successfully!');
console.log('\nTo convert to PNG (required for Chrome Web Store):');
console.log('1. Visit https://cloudconvert.com/svg-to-png');
console.log('2. Upload the SVG files from extension/icons/');
console.log('3. Download and replace with PNG versions');
console.log('\nOr use this command if you have ImageMagick:');
console.log('  cd extension/icons && for file in *.svg; do magick "$file" "${file%.svg}.png"; done');
