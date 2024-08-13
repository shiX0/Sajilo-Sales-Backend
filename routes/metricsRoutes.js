const express = require('express')
const metricsController = require("../controllers/MetricsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', authMiddleware, authMiddleware, metricsController.getMetrics);


module.exports = router;