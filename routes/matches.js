const router = require('express').Router();
let Match = require('../models/match.model');

router.route('/').get((req, res) => {
    Match.find()
        .then(matches => res.json(matches))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Match.findById(req.params.id)
        .then(match => res.json(match))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/:id').delete((req, res) => {
    Match.findByIdAndDelete(req.params.id)
        .then(() => res.json('Match deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').put((req, res) => {
    Match.findById(req.params.id)
        .then(match => {
            match.homeScore = req.body.homeScore;
            match.awayScore = req.body.awayScore;
            match.winner = req.body.winner;

            match.save()
                .then(() => res.json(match))
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

router.route('/add').post((req, res) => {
    const homeTeam = req.body.homeTeam;
    const awayTeam = req.body.awayTeam;
    const homeScore = req.body.homeScore;
    const awayScore = req.body.awayScore;

    const newMatch = new Match({ homeTeam, awayTeam, homeScore, awayScore });

    newMatch.save()
        .then(() => res.json('Match added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;