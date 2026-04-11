// Generate PWA icons as simple SVGs (browsers handle SVG icons well,
// but for full compatibility we create a canvas-based PNG fallback script)
const fs = require("fs");
const path = require("path");

const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#09090b"/>
  <g transform="translate(${size / 2}, ${size / 2})">
    <polygon points="0,${-size * 0.32} ${size * 0.08},${-size * 0.08} ${size * 0.32},0 ${size * 0.08},${size * 0.08} 0,${size * 0.32} ${-size * 0.08},${size * 0.08} ${-size * 0.32},0 ${-size * 0.08},${-size * 0.08}" fill="#7c3aed"/>
    <polygon points="0,${-size * 0.18} ${size * 0.04},${-size * 0.04} ${size * 0.18},0 ${size * 0.04},${size * 0.04} 0,${size * 0.18} ${-size * 0.04},${size * 0.04} ${-size * 0.18},0 ${-size * 0.04},${-size * 0.04}" fill="#a78bfa"/>
  </g>
</svg>`;

const iconsDir = path.join(__dirname, "..", "public", "icons");

// Write SVG versions (used as fallback)
[192, 512].forEach((size) => {
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svg(size));
  console.log(`Generated icon-${size}.svg`);
});
