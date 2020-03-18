const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let Match = require('../models/match.model');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0 },
    bet: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }]
});

playerSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

playerSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;