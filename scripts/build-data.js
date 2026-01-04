#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const cardsDir = path.join(root, "content", "cards");
const responsesRoot = path.join(root, "content", "responses");
const outDir = path.join(root, "data");
const outFile = path.join(outDir, "cards.json");
const outJsFile = path.join(outDir, "cards.js");

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return null;
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch (err) {
    return "";
  }
}

function findImage(dir) {
  const entries = fs.readdirSync(dir);
  const image = entries.find((entry) => /\.(png|jpg|jpeg|webp)$/i.test(entry));
  return image ? path.join(dir, image) : "";
}

function buildCards() {
  if (!fs.existsSync(cardsDir)) {
    return [];
  }

  const slugs = fs.readdirSync(cardsDir).filter((entry) => {
    return fs.statSync(path.join(cardsDir, entry)).isDirectory();
  });

  return slugs.map((slug) => {
    const cardDir = path.join(cardsDir, slug);
    const meta = readJson(path.join(cardDir, "meta.json")) || {};
    const ocrText = readText(path.join(cardDir, "ocr.txt"));
    const imagePath = findImage(cardDir);
    const responses = loadResponses(slug);

    const card = {
      title: meta.title || slug,
      date: meta.date || slug.slice(0, 10),
      time: meta.time || "",
      datetime: meta.datetime || "",
      pinned: Boolean(meta.pinned),
      pinnedOrder: Number.isFinite(meta.pinnedOrder) ? meta.pinnedOrder : null,
      slug: meta.slug || slug,
      status: meta.status || "draft",
      image: imagePath ? path.relative(root, imagePath).replace(/\\/g, "/") : "",
      ocr: ocrText,
      responses
    };
    return card;
  }).filter((card) => card.status !== "draft").sort((a, b) => b.date.localeCompare(a.date));
}

function loadResponses(slug) {
  const responseDir = path.join(responsesRoot, slug);
  if (!fs.existsSync(responseDir)) {
    return [];
  }
  const entries = fs.readdirSync(responseDir).filter((entry) => {
    return fs.statSync(path.join(responseDir, entry)).isDirectory();
  });

  return entries.map((entry) => {
    const dir = path.join(responseDir, entry);
    const meta = readJson(path.join(dir, "meta.json")) || {};
    const ocrText = readText(path.join(dir, "ocr.txt"));
    const imagePath = findImage(dir);

    return {
      title: meta.title || entry,
      name: meta.name || "",
      date: meta.date || entry.slice(0, 10),
      datetime: meta.datetime || "",
      slug: meta.slug || entry,
      image: imagePath ? path.relative(root, imagePath).replace(/\\/g, "/") : "",
      ocr: ocrText
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
}

const cards = buildCards();
const payload = { updatedAt: new Date().toISOString(), cards };

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
fs.writeFileSync(outJsFile, `window.CARDS_DATA = ${JSON.stringify(payload, null, 2)};`);
console.log(`Wrote ${cards.length} cards to ${outFile} and ${outJsFile}`);
