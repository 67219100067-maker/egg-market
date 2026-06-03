const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace 'http://localhost:3001...' with `${import.meta.env.VITE_API_URL}...`
  if (content.includes("'http://localhost:3001")) {
    content = content.replace(/'http:\/\/localhost:3001([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
    changed = true;
  }
  
  // Replace remaining http://localhost:3001 (usually inside template literals like `http://localhost:3001${var}`)
  if (content.includes("http://localhost:3001")) {
      content = content.replace(/http:\/\/localhost:3001/g, '${import.meta.env.VITE_API_URL}');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
