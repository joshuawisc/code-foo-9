const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        from: {type: String, required: true},
        to: {type: String, required: true},
        text: {type: String},

    }
);

module.exports = mongoose.model('Message', MessageSchema);
