const Event = require('../models/event');

exports.isGuest = (req, res, next) => {
    if (!req.session.user) return next();
    else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) return next();
    else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isHost = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
    .then(event => {
        if (event) {
            if (event.host == req.session.user) return next();
            else {
                let err = new Error('Unauthorized access to resource');
                err.status = 401;
                return next(err);
            } 
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};

exports.isNotHost = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id)
    .then(event => {
        if (event) {
            if (event.host != req.session.user) return next();
            else {
                let err = new Error('Unauthorized access to resource');
                err.status = 401;
                return next(err);
            } 
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};