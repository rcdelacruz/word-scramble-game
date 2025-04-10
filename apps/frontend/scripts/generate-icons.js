/**
 * Simple script to generate placeholder icons for the PWA
 * This creates SVG icons with the text "WS" (Word Scramble) in different sizes
 */

const fs = require('fs');
const path = require('path');

// Icon sizes to generate
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Directory to save icons
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure the directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate an SVG icon with the given size
function generateSvgIcon(size) {
  const fontSize = Math.floor(size * 0.5);
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#6366f1" rx="${size * 0.2}" ry="${size * 0.2}" />
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">WS</text>
  </svg>`;

  return svg;
}

// Generate and save icons
sizes.forEach(size => {
  const svg = generateSvgIcon(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);

  fs.writeFileSync(filePath, svg);
  console.log(`Generated icon: ${filePath}`);
});

console.log('Icon generation complete!');
