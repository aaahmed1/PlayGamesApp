const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    category: {type: String, required: [true, 'category is required'], enum: ['Video Games', 'Board Games', 'Soccer', 'Basketball', 'Tennis', 'Other']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    start: {type: Date, required: [true, 'start date is required']},
    end: {type: Date, required: [true, 'end date is required']},
    details: {type: String, required: [true, 'details is required']},
    where: {type: String, required: [true, 'location is required']},
    image: {type: String, required: [true, 'image is required']}
});

module.exports = mongoose.model('Event', eventSchema);