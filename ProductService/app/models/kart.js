/**
 * Created by Roberto Marco
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kartSchema = new Schema({
    kart: [
        {
            id: { type: String },
            amount: { type: Number }
        }
    ],
    user_id: { type: String },
    status: {type: String, default: "pending" },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kart', kartSchema);