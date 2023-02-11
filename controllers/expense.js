const Expenseuser=require('../models/expense');
const Expuser=require('../models/user');


exports.postexpense=(req,res,next)=>{
    const { expenseamount, description, category } = req.body;

    Expenseuser.create({ expenseamount, description, category })
    .then((response)=>{
        res.status(201).json({response, success: true});
    })
    .catch(err => { res.status(500).json({success: false, error: err}) });
}

/*exports.getexpense=(req, res, next)=>{
    Expuser.findAll().then(expence =>{
        return res.status(200).json({expence, success: true})
    })
    .catch(err =>{
        return res.status(500).json({error: err, success: true})
    })
}

exports.deleteexpense=(req, res, next)=>{
    const expenceid = req.params.expenceid;
    Expuser.destroy({where: {id: expenceid}})
    .then(()=>{
        return res.status(200).json({success: true, message: "deleted successfully"})
    })
    .catch(err =>{
        return res.status(500).json({success: true, message: "failed"})
    })
}*/