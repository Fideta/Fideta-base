const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes('--dry-run');

const HERO_REGEX =
  /<div className="product-hero">[\s\S]*?<div className="product-hero__packshot">[\s\S]*?<\/div>\s*<\/div>/m;

const TARGETS = [
  {
    kind: 'principes',
    dir: path.join(ROOT, 'docs', 'principes'),
    componentName: 'PrincipeHero',
    importLine:
      "import PrincipeHero from '@site/src/components/fiches/PrincipeHero';",
  },
  {
    kind: 'produits',
    dir: path.join(ROOT, 'docs', 'produits'),
    componentName: 'ProduitHero',
    importLine:
      "import ProduitHero from '@site/src/components/fiches/ProduitHero';",
  },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (/\.(md|mdx)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function cleanInlineText(value) {
  return (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\*/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function jsxString(value) {
  return `{${JSON.stringify(value || '')}}`;
}

function insertImport(source, importLine) {
  if (source.includes(importLine)) {
    return source;
  }

  const frontmatterMatch = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/);

  if (!frontmatterMatch) {
    return `${importLine}\n\n${source}`;
  }

  const frontmatterBlock = frontmatterMatch[0];
  const rest = source.slice(frontmatterBlock.length);

  return `${frontmatterBlock}${importLine}\n\n${rest}`;
}

function extractFirst(hero, patterns) {
  for (const pattern of patterns) {
    const match = hero.match(pattern);
    if (match && match[1]) {
      return cleanInlineText(match[1]);
    }
  }

  return '';
}

function buildPrincipeComponent({ id, data, hero }) {
  const title = data.title || id;
  const image = data.image || '/img/principes/default-principe.jpg';
  const imageAlt = title;
  const pathValue = `/docs/principes/${id}`;

  const scientificName = extractFirst(hero, [
    /Nom scientifique[\s\S]*?<\/strong>\s*([\s\S]*?)\s*<br\s*\/?>/i,
    /Nom latin[\s\S]*?<\/strong>\s*([\s\S]*?)\s*<br\s*\/?>/i,
    /Nom botanique[\s\S]*?<\/strong>\s*([\s\S]*?)\s*<br\s*\/?>/i,
  ]);

  const partUsed = extractFirst(hero, [
    /Partie utilisée[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<strong>[\s\S]*?Origine)/i,
  ]);

  const origin = extractFirst(hero, [
    /Origine[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
  ]);

  if (!scientificName || !partUsed || !origin) {
    return null;
  }

  return `<PrincipeHero
  title=${jsxString(title)}
  scientificName=${jsxString(scientificName)}
  partUsed=${jsxString(partUsed)}
  origin=${jsxString(origin)}
  image=${jsxString(image)}
  imageAlt=${jsxString(imageAlt)}
  path=${jsxString(pathValue)}
/>`;
}

function buildProduitComponent({ id, data, hero }) {
  const title = data.title || id;
  const image = data.image || '/img/produits/default-produit.jpg';
  const imageAlt = title;
  const pathValue = `/docs/produits/${id}`;

  const brand = extractFirst(hero, [
    /Marque\s*\/\s*Laboratoire[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
    /Laboratoire[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
    /Fabricant[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
  ]);

  const category = extractFirst(hero, [
    /Catégorie[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
    /Famille[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
    /Positionnement revendiqué[\s\S]*?<\/strong>\s*([\s\S]*?)(?:<br\s*\/?>|<\/p>)/i,
  ]);

  if (!brand || !category) {
    return null;
  }

  return `<ProduitHero
  title=${jsxString(title)}
  brand=${jsxString(brand)}
  category=${jsxString(category)}
  image=${jsxString(image)}
  imageAlt=${jsxString(imageAlt)}
  path=${jsxString(pathValue)}
/>`;
}

function migrateFile(filePath, target) {
  const source = fs.readFileSync(filePath, 'utf8');

  if (source.includes(`<${target.componentName}`)) {
    return { status: 'already_done' };
  }

  const heroMatch = source.match(HERO_REGEX);

  if (!heroMatch) {
    return { status: 'no_hero' };
  }

  const heroBlock = heroMatch[0];
  const parsed = matter(source);
  const id = path.basename(filePath).replace(/\.(md|mdx)$/i, '');

  const componentBlock =
    target.kind === 'principes'
      ? buildPrincipeComponent({ id, data: parsed.data, hero: heroBlock })
      : buildProduitComponent({ id, data: parsed.data, hero: heroBlock });

  if (!componentBlock) {
    return { status: 'manual_review' };
  }

  let next = source.replace(heroBlock, componentBlock);
  next = insertImport(next, target.importLine);

  if (next === source) {
    return { status: 'unchanged' };
  }

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, next, 'utf8');
  }

  return { status: 'updated' };
}

function main() {
  const summary = {
    updated: [],
    already_done: [],
    no_hero: [],
    manual_review: [],
    unchanged: [],
  };

  for (const target of TARGETS) {
    const files = walk(target.dir);

    for (const filePath of files) {
      const result = migrateFile(filePath, target);
      summary[result.status].push(path.relative(ROOT, filePath));
    }
  }

  console.log(DRY_RUN ? '\nMode dry-run\n' : '\nMode écriture\n');

  for (const [status, files] of Object.entries(summary)) {
    console.log(`${status}: ${files.length}`);
    files.forEach((file) => console.log(`  - ${file}`));
  }
}

main();