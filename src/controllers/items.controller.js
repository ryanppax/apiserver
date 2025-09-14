const store = require("../services/items.store");

function parseId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

exports.list = (req, res, next) => {
  try {
    res.json(store.list());
  } catch (e) { next(e); }
};

exports.get = (req, res, next) => {
  try {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const item = store.get(id);
    if (!item) return res.status(404).json({ error: "not found" });
    res.json(item);
  } catch (e) { next(e); }
};

exports.create = (req, res, next) => {
  try {
    const { name, ...rest } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const item = store.create({ name, ...rest });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

exports.updateFull = (req, res, next) => {
  try {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const { name, ...rest } = req.body || {};
    if (!name) return res.status(400).json({ error: "name is required" });
    const updated = store.updateFull(id, { name, ...rest });
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (e) { next(e); }
};

exports.updatePartial = (req, res, next) => {
  try {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const updated = store.updatePartial(id, req.body || {});
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (e) { next(e); }
};

exports.remove = (req, res, next) => {
  try {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const ok = store.remove(id);
    if (!ok) return res.status(404).json({ error: "not found" });
    res.status(204).end();
  } catch (e) { next(e); }
};
