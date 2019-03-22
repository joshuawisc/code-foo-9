const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let UserSchema = require('./userModel.js').schema;

var MessageSchema = new Schema(
    {
        from: {type: UserSchema, required: true},
        text: {type: String},
        time: { type: Date, default: Date.now},

    }
);

module.exports = mongoose.model('Message', MessageSchema);
