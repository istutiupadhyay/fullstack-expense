const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const premiumRoutes=require('./routes/premium');
const resetPasswordRoutes = require('./routes/resetpassword');

const Expuser=require('./models/user');
const Expense=require('./models/expense');
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');

app.use(userRoutes)
app.use(expenseRoutes);
app.use('/purchase',premiumRoutes);
app.use('/password', resetPasswordRoutes);


app.set('views', 'views');
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Expuser.hasMany(Expense);
Expense.belongsTo(Expuser);

Expuser.hasMany(Order);
Order.belongsTo(Expuser);

Expuser.hasMany(Forgotpassword);
Forgotpassword.belongsTo(Expuser);

sequelize
.sync()
.then(result=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})
