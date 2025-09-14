const { Router } = require("express");
const controller = require("../controllers/items.controller");
const authorize = require("../middleware/authorize");

const router = Router();

router.get("/", authorize("items:read"), controller.list);
router.post("/", authorize("items:write"), controller.create);
router.get("/:id", authorize("items:read"), controller.get);
router.put("/:id", authorize("items:write"), controller.updateFull);
router.patch("/:id", authorize("items:write"), controller.updatePartial);
router.delete("/:id", authorize("items:write"), controller.remove);

module.exports = router;
