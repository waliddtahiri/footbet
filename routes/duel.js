const router = require('express').Router();
let Duel = require('../models/duel.model');
let Match = require('../models/match.model');
let Player = require('../models/player.model');

router.route('/').get((req, res) => {
    Duel.find()
        .then(duels => res.json(duels))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Duel.findById(req.params.id).populate('challenger')
        .then(duel => res.json(duel))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;