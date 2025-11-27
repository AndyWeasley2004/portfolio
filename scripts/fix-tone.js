const fs = require('fs');
const path = require('path');

try {
  const tonePackagePath = path.resolve(__dirname, '../node_modules/tone/package.json');

  if (fs.existsSync(tonePackagePath)) {
    const pkg = JSON.parse(fs.readFileSync(tonePackagePath, 'utf8'));
    // We want to force usage of the UMD build to avoid Webpack 5 strict ESM issues
    // and missing exports in the ESM build of tone 14.9.17
    if (pkg.main !== 'build/Tone.js' || pkg.type === 'module') {
      console.log('Fixing tone package.json for Webpack 5 compatibility...');
      
      pkg.main = 'build/Tone.js';
      // Remove ESM markers
      delete pkg.module;
      delete pkg.type;
      delete pkg.exports; // just in case
      
      fs.writeFileSync(tonePackagePath, JSON.stringify(pkg, null, 4));
      console.log('Fixed tone package.json');
    } else {
      console.log('tone package.json already fixed.');
    }
  } else {
    console.log('tone package not found in node_modules');
  }
} catch (e) {
  console.error('Error fixing tone:', e);
}

