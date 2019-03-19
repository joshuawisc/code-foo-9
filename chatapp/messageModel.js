const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        from: {type: String, required: true},
        to: {type: String, required: true},
        text: {type: String},
        time: { type: Date, default: Date.now},

    }
);

module.exports = mongoose.model('Message', MessageSchema);
