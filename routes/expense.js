const path=require('path');
const express=require('express');
const expenseController=require('../controllers/expense')
const router=express.Router();
router.post('/add-expense', expenseController.postexpense);
router.get('/get-expense', expenseController.getexpense);
router.delete('/delete-expense/:id', expenseController.deleteexpense);

module.exports=router;