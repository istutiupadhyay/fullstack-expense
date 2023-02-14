const Expuser = require('../models/user');
const Expenseuser = require('../models/expense');
const sequelize = require('../util/database')
 const getleaderboard = async(req, res) => {
    try{
        const learderboardusers = await Expuser.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expence')), 'total_cost']],
            include: [
                {
                    model: Expenseuser,
                    attributes: []
                }
            ],
            group: ['user.userId']
        })
        const expenses = await Expenseuser.findAll({
            attributes: ['userId', [sequelize.fn('sum', sequelize.col('expenses.expence')), 'total_cost']],
            group: ['userId'],
            order: [sequelize.col('total_cost'), 'DESC']
        });
        
    }catch(err){
        console.log(err);
        res.status(500).join(err)
    }
 }
 module.exports = {
    getleaderboard
 }
