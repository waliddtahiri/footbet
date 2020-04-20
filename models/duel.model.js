const mongoose = require('mongoose');
let Match = require('./match.model');
let Challenge = require('./challenge.model');

const Schema = mongoose.Schema;

const duelSchema = new Schema({
    challenger: {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    challenged: {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }
})


const Duel = mongoose.model('Duel', duelSchema);

module.exports = Duel;