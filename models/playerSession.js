const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const playerSessionSchema = new Schema({
    userId: { type: String, default: ''},
    timestamp: { type: Date, default: Date.now()},
    isDeleted: { type: Boolean, default: false}
})

const PlayerSession = mongoose.model('playerSession', playerSessionSchema);

module.exports = PlayerSession;