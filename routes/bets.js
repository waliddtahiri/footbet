const router = require('express').Router();
let Bet = require('../models/bet.model');
let Match = require('../models/match.model');
let Player = require('../models/player.model');

router.route('/').get((req, res) => {
    Bet.find()
        .then(bets => res.json(bets))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Bet.findById(req.params.id).populate('match')
        .then(bet => res.json(bet))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/add').post((req, res) => {

    const { body } = req;
    let { player, match, homeScore, awayScore, winner, betting} = body;

    const newBet = new Bet({
        player: player, match: match, homeScore: homeScore, awayScore: awayScore, winner: winner, betting: betting
    });

    newBet.save().then(() => res.json(newBet))
    
});


module.exports = router;