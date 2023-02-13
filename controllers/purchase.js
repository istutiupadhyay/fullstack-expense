const Razorpay = require('razorpay');
const Order = require('../models/order')


const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })
        const amount = 1000;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                console.log(err);

                throw new Error(err);
            }
            console.log(order);
            console.log(req.user);
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {            
                    return res.status(201).json({ order, rzp_test_9c5gion9QcK1kb : rzp.rzp_test_9c5gion9QcK1kb});
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
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

module.exports = {
    purchasepremium,
    updateTransactionStatus
}