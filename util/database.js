const Sequelize=require('sequelize')

const sequelize= new Sequelize('expense','root','Root@12345',{
    dialect :'mysql',
    host:'localhost'
})

 module.exports=sequelize;