const {body} = require("express-validator");
exports.productValidationRules = {
    add:[
        body("title").trim()
        .isLength({min:5,max:100})
        .withMessage("title should be 5 letters and maximum 100."),
        body("price").trim().isFloat({min:0.0,max:3000.0})
        .withMessage("Price should be more than 1 JOD and less than 1000")
    ]
}