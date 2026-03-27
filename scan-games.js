#!/usr/bin/env node

/**
 * Game Directory Scanner
 * Scans a Laravel public/games directory and generates a PHP array
 * suitable for use in a GameSeeder.
 *
 * Usage:
 *   node scan-games.js [options]
 *
 * Options:
 *   --dir <path>          Path to the public/games directory (default: ./public/games)
 *   --dir-num <n>         Only scan a specific numbered subfolder (e.g. --dir-num 4)
 *   --category <name>     Default category for all found games (default: Arcade)
 *   --premium             Mark all games as premium (default: false)
 *   --out <file>          Write output to a file instead of stdout
 *   --format <fmt>        Output format: php | json (default: php)
 *   --help                Show this help message
 *
 * Directory structure variants supported:
 *   Type A (e.g. games/1, games/2, games/3):
 *     public/games/<n>/<GAME NAME>/HTML5/HTML5/index.html
 *     public/games/<n>/<GAME NAME>/Icons/Icon_1024.png   <- icon search
 *
 *   Type B (games/4):
 *     public/games/4/<GAME NAME>/1-Game File/index.html
 *     Looks for icon anywhere inside the game folder.
 *
 * Icon detection:
 *   Searches recursively inside each game folder for files whose name
 *   (case-insensitive) contains "icon" and ends in .png, .jpg, or .jpeg.
 *   Prefers higher resolution variants (1024 > 512 > 256 > other).
 *
 * Examples:
 *   node scan-games.js
 *   node scan-games.js --dir /var/www/html/public/games
 *   node scan-games.js --dir-num 4 --category Action
 *   node scan-games.js --out new_games.php
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

function getArg(flag, fallback = null) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

function hasFlag(flag) {
  return args.includes(flag);
}

if (hasFlag('--help') || hasFlag('-h')) {
  // Print the comment block at the top of this file as help text
  const src   = fs.readFileSync(__filename, 'utf8');
  const match = src.match(/^\/\*\*([\s\S]*?)\*\//);
  if (match) console.log(match[0]);
  process.exit(0);
}

const GAMES_DIR  = getArg('--dir', path.join(process.cwd(), 'public', 'games'));
const DIR_NUM    = getArg('--dir-num');          // e.g. "4"
const CATEGORY   = getArg('--category', 'Arcade');
const IS_PREMIUM = hasFlag('--premium');
const OUT_FILE   = getArg('--out');
const FORMAT     = getArg('--format', 'php');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all files under a directory. */
function walkDir(dir, collected = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return collected;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(full, collected);
    } else {
      collected.push(full);
    }
  }
  return collected;
}

/**
 * Given a game folder (absolute path), find the best icon file and return
 * its path relative to the `public` directory (i.e. the web-accessible path).
 */
function findIcon(gameFolderAbs, publicRoot) {
  const allFiles = walkDir(gameFolderAbs);
  const iconFiles = allFiles.filter(f => {
    const base = path.basename(f).toLowerCase();
    return base.includes('icon') && /\.(png|jpe?g)$/i.test(base);
  });

  if (!iconFiles.length) return null;

  // Score by resolution hint in filename
  const score = f => {
    const b = path.basename(f).toLowerCase();
    if (b.includes('1024')) return 4;
    if (b.includes('512'))  return 3;
    if (b.includes('256'))  return 2;
    if (b.includes('128'))  return 1;
    return 0;
  };

  iconFiles.sort((a, b) => score(b) - score(a));
  const best = iconFiles[0];

  // Make it a web path relative to publicRoot
  return '/' + path.relative(publicRoot, best).replace(/\\/g, '/');
}

/**
 * Given a game folder (absolute path), find the main index.html entry point
 * and return its web path. Tries common structures first, then falls back to
 * any index.html found recursively.
 */
function findIndexHtml(gameFolderAbs, publicRoot) {
  // Common path patterns, tried in order
  const candidates = [
    path.join(gameFolderAbs, 'HTML5', 'HTML5', 'index.html'),
    path.join(gameFolderAbs, 'HTML5', 'index.html'),
    path.join(gameFolderAbs, 'html5', 'index.html'),
    path.join(gameFolderAbs, 'game', 'index.html'),
    path.join(gameFolderAbs, 'live_demo', 'index.html'),
    path.join(gameFolderAbs, '1-Game File', 'index.html'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return '/' + path.relative(publicRoot, c).replace(/\\/g, '/');
    }
  }

  // Type B: single subfolder like "1-Game File"
  try {
    const subs = fs.readdirSync(gameFolderAbs, { withFileTypes: true })
      .filter(e => e.isDirectory());
    for (const sub of subs) {
      const idx = path.join(gameFolderAbs, sub.name, 'index.html');
      if (fs.existsSync(idx)) {
        return '/' + path.relative(publicRoot, idx).replace(/\\/g, '/');
      }
    }
  } catch { /* ignore */ }

  // Last resort: any index.html anywhere in the tree
  const all = walkDir(gameFolderAbs).filter(f => path.basename(f) === 'index.html');
  if (all.length) {
    return '/' + path.relative(publicRoot, all[0]).replace(/\\/g, '/');
  }

  return null;
}

/** Convert a folder name into a readable title. */
function folderToTitle(name) {
  // Strip leading numeric prefix like "01.", "1.", "1-", etc.
  return name
    .replace(/^\d+[\.\-\s]+/, '')
    .trim();
}

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------

/**
 * Find the `public` root by walking up from GAMES_DIR looking for a folder
 * whose direct child is named `games`. Falls back to parent of GAMES_DIR.
 */
function findPublicRoot() {
  // GAMES_DIR should be something like …/public/games
  return path.dirname(GAMES_DIR);
}

const PUBLIC_ROOT = findPublicRoot();

function scanNumberedDir(numDir) {
  const numDirAbs = path.join(GAMES_DIR, numDir);
  let gameFolders;
  try {
    gameFolders = fs.readdirSync(numDirAbs, { withFileTypes: true })
      .filter(e => e.isDirectory());
  } catch (err) {
    console.error(`Cannot read directory: ${numDirAbs}\n${err.message}`);
    return [];
  }

  const results = [];

  for (const gf of gameFolders) {
    const gameName    = gf.name;
    const gameFolderAbs = path.join(numDirAbs, gameName);
    const title       = folderToTitle(gameName);

    const iconPath  = findIcon(gameFolderAbs, PUBLIC_ROOT);
    const indexPath = findIndexHtml(gameFolderAbs, PUBLIC_ROOT);

    if (!indexPath) {
      process.stderr.write(`  [WARN] No index.html found for: ${gameName}\n`);
    }

    results.push({
      title,
      folder: gameName,
      numDir,
      url:       indexPath  ?? '(NOT FOUND)',
      thumbnail: iconPath   ?? 'https://placehold.co/400x300',
      category:  CATEGORY,
      is_premium: IS_PREMIUM,
    });
  }

  return results;
}

// Decide which numbered directories to scan
let numDirs;
if (DIR_NUM) {
  numDirs = [DIR_NUM];
} else {
  try {
    numDirs = fs.readdirSync(GAMES_DIR, { withFileTypes: true })
      .filter(e => e.isDirectory() && /^\d+$/.test(e.name))
      .map(e => e.name)
      .sort((a, b) => Number(a) - Number(b));
  } catch (err) {
    console.error(`Cannot read games directory: ${GAMES_DIR}\n${err.message}`);
    process.exit(1);
  }
}

if (!numDirs.length) {
  console.error(`No numbered subdirectories found under: ${GAMES_DIR}`);
  process.exit(1);
}

const allGames = [];
for (const n of numDirs) {
  process.stderr.write(`Scanning games/${n}...\n`);
  allGames.push(...scanNumberedDir(n));
}

process.stderr.write(`Found ${allGames.length} game(s).\n\n`);

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function phpString(str) {
  if (str === null) return 'null';
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function phpBool(v) {
  return v ? 'true' : 'false';
}

function renderPhp(games) {
  const indent = '            ';
  const entries = games.map(g => {
    return [
      `        [`,
      `${indent}'title'       => ${phpString(g.title)},`,
      `${indent}'description' => '',`,
      `${indent}'category'    => GameCategory::${g.category},`,
      `${indent}'scoring_config' => ['type' => 'points'],`,
      `${indent}'is_premium'  => ${phpBool(g.is_premium)},`,
      `${indent}'url'         => ${phpString(g.url)},`,
      `${indent}'thumbnail'   => ${phpString(g.thumbnail)},`,
      `        ],`,
    ].join('\n');
  });

  return [
    `<?php`,
    `// Auto-generated by scan-games.js`,
    `// Games scanned from: ${GAMES_DIR}`,
    `// Generated at: ${new Date().toISOString()}`,
    ``,
    `$games = [`,
    entries.join('\n'),
    `];`,
  ].join('\n');
}

function renderJson(games) {
  return JSON.stringify(games, null, 2);
}

const output = FORMAT === 'json' ? renderJson(allGames) : renderPhp(allGames);

if (OUT_FILE) {
  fs.writeFileSync(OUT_FILE, output, 'utf8');
  process.stderr.write(`Output written to: ${OUT_FILE}\n`);
} else {
  process.stdout.write(output + '\n');
}