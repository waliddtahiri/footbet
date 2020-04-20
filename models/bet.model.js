const mongoose = require('mongoose');
let Player = require('../models/player.model');
let Match = require('../models/match.model');

const Schema = mongoose.Schema;

const betSchema = new Schema({
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    homeScore: { type: Number, required: true},
    awayScore: { type: Number, required: true},
    winner: { type: String, required:true},
    betting: { type: Number, required: true},
})


const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;