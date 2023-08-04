const express = require('express');
const controller = require('../controllers/eventsController');
const {fileUpload} = require('../middleware/fileUpload');
const {isLoggedIn, isHost, isNotHost} = require('../middleware/auth');
const {validateId, validateEvent, validateRSVP, validateResult} = require('../middleware/validator');

const router = express.Router();

router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.post('/', isLoggedIn, fileUpload, validateEvent, validateResult, controller.create);

router.get('/:id', validateId, controller.show);

router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

router.put('/:id', validateId, isLoggedIn, isHost, fileUpload, validateEvent, validateResult, controller.update);

router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', validateId, isLoggedIn, isNotHost, validateRSVP, validateResult, controller.rsvp);

module.exports = router;