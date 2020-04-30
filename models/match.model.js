const mongoose = require('mongoose');
let Competition = require('../models/competition.model');

const Schema = mongoose.Schema;

const matchSchema = new Schema({
    homeTeam: { type: String, required: true},
    awayTeam: { type: String, required: true},
    homeScore: { type: String, required: false},
    awayScore: { type: String, required: false},
    competition: {
        type: Schema.Types.ObjectId,
        ref: 'Competition',
        required: false
    },
    matchday: { type: Number, required: false},
    winner: { type: String, required: false}
})


const Match = mongoose.model('Match', matchSchema);

module.exports = Match;