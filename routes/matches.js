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
    const { body } = req;
    let { homeScore, awayScore, winner } = body;

    if (homeScore == null || homeScore == undefined || awayScore == null || awayScore == undefined) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (/\D/.test(homeScore) || (/\D/.test(awayScore))) {
        return res.status(400).json({ msg: 'Please only enter numeric characters' });
    }
    if (homeScore > 99 || awayScore > 99) {
        return res.status(400).json({ msg: 'Please enter a score under 99' });
    }
    Match.findById(req.params.id)
        .then(match => {
            match.homeScore = homeScore;
            match.awayScore = awayScore;
            match.winner = winner;

            match.save()
                .then(() => res.json(match))
                .catch(err => res.status(400).json({ msg: 'Error: ' + err }));
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