const mongoose = require('mongoose');
let Player = require('./player.model');
let Match = require('./match.model');

const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    opponent: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
    betting: { type: Number, required: true },
    status: { type: String, required: true }
})


const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;