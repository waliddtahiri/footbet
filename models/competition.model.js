const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Match = require('../models/match.model');


const competitionSchema = new Schema({
    name: { type: String, required: true},
    matchs: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }]
})

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;