const Expense = require('../models/expenses');
const s3Services=require('../services/s3services');
const downloadedURLS=require('../models/downloadedfiles');


const addexpense = (req, res) => {
    const { expenseamount, description, category} = req.body;
    let total=req.user.TotalCost;
    total=total+(+expenseamount);
    Expense.create({ expenseamount, description, category, userId: req.user.id}).then(expense => {
        req.user.update({TotalCost:total})
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {

    Expense.findAll().then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: { id: expenseid }}).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}

const getAllExpense = (req,res,next)=>{
    Expense.findAll({where:{userId:req.user.id}})
    .then(data=>{
        res.status(201).json({data:data})
    })
    .catch(err=>console.log(err))
}

const downloadExpense = (req,res)=>{
    try{
        const expenses= req.user.getExpenses();
        const stringifiedExpense=JSON.stringify(expenses);
        const userId=req.user.id;
        const date=new Date();
        const filename=`Expense${userId}/${date}.txt`;
        const fileURL= s3Services.uploadToS3(stringifiedExpense, filename);
        downloadedURLS.create({url:fileURL,date,userId})
        res.status(200).json({fileURL, success:true, message:'Downloaded Successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:'Something went wrong'})
    }

}

const getDownloadHistory = (req,res)=>{
    try{
        const userId=req.user.id;
        downloadedURLS.findAll({where:{id:userId}})
        .then(data=>{
            res.status(201).json({data:data, success:true})
        }).catch(err=>{
            throw new Error(err)
        })
    }catch(err){
        console.log(err)
        res.status(400).json({success:false})
    }
}



module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    getAllExpense,
    downloadExpense,
    getDownloadHistory
}    