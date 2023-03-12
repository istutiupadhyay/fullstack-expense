const express = require('express');

const purchaseController = require('../controller/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

router.get('/premiumusers',authenticatemiddleware.authenticate, purchaseController.getPremiumUser);

router.get('/getdetails/:userId', purchaseController.getUserDetails);

module.exports = router;
