const express = require('express');

const userController = require('../controller/user');
const expenseController = require('../controller/expense')

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();


router.post('/signup', userController.signup);

router.post('/login', userController.login)

router.post('/addexpense', authenticatemiddleware.authenticate, expenseController.addexpense )

router.get('/getexpenses', authenticatemiddleware.authenticate, expenseController.getexpenses )

//router.get('/getalluser',authenticatemiddleware.authenticate,expenseController.getAllUser);
router.get('/getallexpenses', authenticatemiddleware.authenticate, expenseController.getAllExpense);

router.delete('/deleteexpense/:expenseid', authenticatemiddleware.authenticate, expenseController.deleteexpense)

router.get('/download', authenticatemiddleware.authenticate, expenseController.downloadExpense);

router.get('/downloadhistory', authenticatemiddleware.authenticate, expenseController.getDownloadHistory);

router.get('/getusers',userController.getUser);

module.exports = router;