const express = require('express')
const MetricsController = require("../controllers/MetricsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', authMiddleware, authMiddleware, MetricsController.getMetrics);


module.exports = router;