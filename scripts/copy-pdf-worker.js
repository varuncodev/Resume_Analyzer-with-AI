// scripts/copy-pdf-worker.js
// Run this once after npm install to copy the pdf.js worker to /public
const fs   = require('fs');
const path = require('path');

const src  = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
const dest = path.resolve(__dirname, '../public/pdf.worker.min.js');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅  pdf.worker.min.js copied to /public');
} else {
  console.error('❌  Could not find pdf.worker.min.js. Run: npm install');
  process.exit(1);
}
