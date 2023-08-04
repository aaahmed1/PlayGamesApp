const model = require('../models/event');
const rsvpModel = require('../models/rsvp');
const {DateTime} = require('luxon');


exports.index = (req, res, next) => {
    let events;
    let categories;
    model.distinct('category')
    .then((query) => {
        categories = query;
        return model.find();
    })
    .then((query) => {
        events = query;
        res.render('events', {events, categories});
    })
    .catch(err => next(err));
}

exports.new = (req, res) => {
    res.render('newEvent');
}

exports.create = (req, res, next) => {
    let image = '/images/' + req.file.filename;
    req.body.image = image;
    req.body.host = req.session.user;
    let event = new model(req.body);
    event.save()
    .then((event) => {
        req.flash('success', 'Event succesfully created');
        res.redirect('/events');
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
}

exports.show = (req, res, next) => {
    let id = req.params.id;
    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvpModel.find({event: id, status: 'YES'})])
    .then(results => {
        const [event, rsvps] = results;
        if(event) {
            let start = DateTime.fromJSDate(event.start).toLocaleString(DateTime.DATETIME_MED);
            let end = DateTime.fromJSDate(event.end).toLocaleString(DateTime.DATETIME_MED);
            res.render('event', {event, start, end, rsvps});
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
        
    })
    .catch(err => next(err));  
}

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(event => {
        if(event) {
            let start = DateTime.fromJSDate(event.start).toISO({includeOffset: false});
            let end = DateTime.fromJSDate(event.end).toISO({includeOffset: false});
            res.render('edit', {event, start, end});
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
        
    })
    .catch(err => next(err));
}

exports.update = (req, res, next) => {
    let id = req.params.id;
    let newEvent = req.body;

    let image = '/images/' + req.file.filename;
    req.body.image = image;

    model.findByIdAndUpdate(id, newEvent, {runValidators: true})
    .then(event => {
        if (event) {
            req.flash('success', 'Event successfully updated');
            res.redirect('/events/' + id);
        } else {
            let err = new Error('Cannot find an event with id ' + id);
             err.status = 404;
             next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
}

exports.delete = (req, res, next) => {
    let id = req.params.id;

    Promise.all([model.findByIdAndDelete(id), rsvpModel.deleteMany({event: id})])
    .then(results => {
        const [event, rsvps] = results;
        if (event) {
            req.flash('success', 'Event successfully deleted');
            res.redirect('/events');
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err.message));
}

exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    let theRsvp = {user: req.session.user, event: id};

    rsvpModel.findOneAndUpdate(theRsvp, {status: req.body.status}, {upsert: true, runValidators: true})
    .then(result => {
        if (result) {
            req.flash('success', 'Successfully updated your RSVP for this event!');
            res.redirect('/users/profile'); 
        } else {
            req.flash('success', 'Successfully created an RSVP for this event!');
            res.redirect('/users/profile');
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
}