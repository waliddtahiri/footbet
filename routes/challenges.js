const router = require('express').Router();
let Challenge = require('../models/challenge.model');

router.route('/').get((req, res) => {
    Challenge.find()
        .then(duels => res.json(duels))
        .catch(err => res.status(400).jsen('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Challenge.findById(req.params.id).populate('challenger', 'opponent')
        .then(duel => res.json(duel))
        .catch(err => res.status(400).jsen('Error: ' + err));
});

module.exports = router;