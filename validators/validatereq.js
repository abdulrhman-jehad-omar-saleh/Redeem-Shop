const {validationResult} = require("express-validator");
exports.validate_product=(req,res,next)=>{
const errors = validationResult(req);
if(errors.isEmpty())
    next();
else{
    old_data = {
        title:req.body.title,
        price:req.body.price,
        desc:req.body.desc,
        provider:req.body.provider,
        codes:req.body.codes,
        category:req.body.category,
        productImage:req.body.productImage,
        endAt:req.body.endAt,
        startAt:req.body.startAt,
        redeemRadio:req.body.redeemRadio,
    }
    error_messages =[]
    for (let e of errors.errors)
        error_messages.push(e.msg);
    //console.log(error_messages,old_data);

    req.flash('errors',{old_data:old_data,
        error_messages:error_messages
    });
    res.redirect("/admin/AddEditProduct");
}
};