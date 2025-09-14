const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "items.json");

let writeQueue = Promise.resolve();

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

function loadAll() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const arr = JSON.parse(raw);
  return Array.isArray(arr) ? arr : [];
}

function nextIdFrom(arr) {
  return (arr.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0) || 0) + 1;
}

async function atomicSave(arr) {
  const tmp = DATA_FILE + ".tmp";
  await fsp.writeFile(tmp, JSON.stringify(arr, null, 2));
  await fsp.rename(tmp, DATA_FILE);
}

exports.list = function list() {
  return loadAll();
};

exports.get = function get(id) {
  const all = loadAll();
  return all.find((x) => x.id === id) || null;
};

exports.create = function create(data) {
  const all = loadAll();
  const now = new Date().toISOString();
  const item = { id: nextIdFrom(all), ...data, createdAt: now };
  all.push(item);
  writeQueue = writeQueue.then(() => atomicSave(all)).catch(() => {});
  return item;
};

exports.updateFull = function updateFull(id, data) {
  const all = loadAll();
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated = { ...all[idx], ...data, updatedAt: now };
  all[idx] = updated;
  writeQueue = writeQueue.then(() => atomicSave(all)).catch(() => {});
  return updated;
};

exports.updatePartial = function updatePartial(id, patch) {
  const all = loadAll();
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated = { ...all[idx], ...patch, updatedAt: now };
  all[idx] = updated;
  writeQueue = writeQueue.then(() => atomicSave(all)).catch(() => {});
  return updated;
};

exports.remove = function remove(id) {
  const all = loadAll();
  const idx = all.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  all.splice(idx, 1);
  writeQueue = writeQueue.then(() => atomicSave(all)).catch(() => {});
  return true;
};
