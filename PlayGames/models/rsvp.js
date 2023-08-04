const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    status: {type: String, required: [true, 'status is required'], enum: ['YES', 'NO', 'MAYBE']},
});

module.exports = mongoose.model('Rsvp', rsvpSchema);