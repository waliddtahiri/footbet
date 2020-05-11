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
    Duel.findById(req.params.id).populate('match').populate('challenger').populate('challenged')
        .then(duel => res.json(duel))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/challenger/:id').get((req, res) => {
    Duel.findById(req.params.id).populate('challenger')
        .then(duel => res.json(duel))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/challenged/:id').get((req, res) => {
    Duel.findById(req.params.id).populate('challenged')
        .then(duel => res.json(duel))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id').delete((req, res) => {
    Duel.findByIdAndDelete(req.params.id)
        .then(() => res.json('Duel deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').put((req, res) => {
    Duel.findById(req.params.id)
        .then(duel => {
            duel.winner = req.body.winner;

            duel.save()
                .then(() => res.json(duel))
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

module.exports = router;