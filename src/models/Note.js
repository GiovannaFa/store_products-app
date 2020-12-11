const mongoose = require('mongoose');

const{ Schema } = mongoose;

const NoteSchema = new Schema ({
    title: {type: String, required: true},
    description: {type: String, required: false},
    quantity: {type: Number, default: 0, required: true},
    price: {type: Number, default: 0},
    actual_price: {type: Number, default: 0},
    expire_date: {type: Date},
    date: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.ObjectId}
});

module.exports = mongoose.model('Note', NoteSchema)