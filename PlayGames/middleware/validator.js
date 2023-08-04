const {body, validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

function validateEnd(value, {req, location, path}) {
    const endDate = new Date(value);
    const startDate = new Date(req.body.start);
    return endDate > startDate;
}

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(), 
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(), 
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateEvent = [body('title', 'Title cannot be empty').notEmpty().trim().escape(), 
body('category', 'Category must be a valid category').isIn(['Video Games', 'Board Games', 'Soccer', 'Basketball', 'Tennis', 'Other']).trim().escape(), 
body('start', 'Start must be a valid start date').isISO8601().isAfter().trim().escape(),
body('end', 'End must be a valid end date').isISO8601().custom(validateEnd).trim().escape(), 
body('details', 'Details cannot be empty').notEmpty().trim().escape(), 
body('where', 'Location cannot be empty').notEmpty().trim().escape()];

exports.validateRSVP = [body('status', 'Status needs to be a valid status').isIn(['YES', 'NO', 'MAYBE']).trim().escape()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};