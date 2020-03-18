const router = require('express').Router();
let Competition = require('../models/competition.model');
let Match = require('../models/match.model');

router.route('/').get((req, res) => {
    Competition.find()
        .then(competitions => res.json(competitions))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/all').get((req, res) => {
    let ids = [];
    Competition.find()
        .then(competitions => {
            competitions.forEach(competition => 
                ids.push(competition._id)
            )
            res.json(ids)
        }).catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Match.find({ competition: req.params.id }).populate('competition', 'name')
        .then(matchs => res.json(matchs))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;