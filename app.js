const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const app = express();
app.use(cors());
app.use(express.json());
const userRoutes=require('./routes/user');
const Expuser=require('./models/user');
app.use(userRoutes)

app.set('views', 'views');
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize
.sync()
.then(result=>{
    app.listen(4000);
})
.catch(err=>{
    console.log(err);
})