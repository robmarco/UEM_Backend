var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    imageType: { type: String,
                 enum: ['thumbnail', 'detail'] 
               },
    url: { type: String }
});

var tshirtSchema = new Schema({
    model:  { type: String },
    images: [ imageSchema ],
    style:  { 
              type: String,
              enum: ['Casual', 'Vintage', 'Alternative'] 
            },
    size:   { 
              type: String,
              enum: [36, 38, 40, 42, 44, 46]
            },
    color:  { type: String },
    price:  { type: Number },
    description: { type: String },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
});

tshirtSchema.path('model').validate(function (v) {
    return ((v != "") && (v != null));
});

module.exports = mongoose.model('Tshirt', tshirtSchema);