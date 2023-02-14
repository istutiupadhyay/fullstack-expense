const express = require('express');
const premiumfeatureController = require('../controllers/premiumfeature');
const authenticatemiddleware = require('../middleware/auth');
const router = express.router();
router.get('/showleaderboard', authenticatemiddleware.authenticate.premiumfeatureController.getleaderboard);
module.exports = router;