const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src', 'components'));

const replacements = [
  { target: /text-ink/g, replacement: 'text-navy' },
  { target: /text-brass/g, replacement: 'text-deep-blue' },
  { target: /border-brass/g, replacement: 'border-deep-blue' },
  { target: /bg-brass/g, replacement: 'bg-deep-blue' },
  { target: /text-sage/g, replacement: 'text-whatsapp-green' },
  { target: /bg-sage/g, replacement: 'bg-whatsapp-green' },
  { target: /border-sage/g, replacement: 'border-whatsapp-green' },
  { target: /text-slate-blue/g, replacement: 'text-sky' },
  { target: /bg-slate-blue/g, replacement: 'bg-sky' },
  { target: /border-slate-blue/g, replacement: 'border-sky' },
  { target: /font-serif/g, replacement: 'font-serif' }, // Keep as font-serif, tailwind handles Poppins
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.target, r.replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
console.log('Done replacing tokens.');
