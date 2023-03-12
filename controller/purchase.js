const Razorpay = require('razorpay');
const Order = require('../models/orders')
const Expense = require('../models/expenses');
const Users=('../models/users');

const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatus = (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: true})
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

const getPremiumUser = (req,res,next)=>{
    req.user.getOrders({where:{status:'SUCCESSFUL'}})
    .then(data=>{
        if(data.length>0){
            res.json({ispremiumuser:true, message:'Premium User'})
        }else{
            res.json({ispremiumuser:false, message:'Not Premium User'})
        }   
    })
    .catch(err=>{
        console.log(err)
    })
}

const getUserDetails=async(req,res,next)=>{
    const userId= req.params.userId;
    // console.log(userId)
    Expense.findAll({where:{userId:userId}})
    .then((data)=>{
        res.json({data:data})
    }).catch(err => console.log(err))
}


module.exports = {
    purchasepremium,
    updateTransactionStatus,
    getPremiumUser,
    getUserDetails
}