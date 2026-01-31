const express = require("express");
const router = express.Router();
const checkController = require("../controllers/check.controller");

router.get("/", checkController.getAllChecks);
router.get("/:id", checkController.getCheckById);
router.post("/", checkController.createCheck);
router.put("/:id", checkController.updateCheck);
router.delete("/:id", checkController.deleteCheck);
router.patch("/:id/status", checkController.updateCheckStatus);

module.exports = router;
