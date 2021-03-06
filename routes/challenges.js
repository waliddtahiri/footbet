const router = require('express').Router();
let Challenge = require('../models/challenge.model');

router.route('/').get((req, res) => {
    Challenge.find()
        .then(challenges => res.json(challenges))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Challenge.findById(req.params.id).populate('opponent')
        .then(challenge => res.json(challenge))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').put((req, res) => {
    Challenge.findById(req.params.id)
        .then(challenge => {
            challenge.homeScore = req.body.homeScore;
            challenge.awayScore = req.body.awayScore;
            challenge.status = "Accepted";

            challenge.save()
                .then(() => res.json(challenge))
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

router.route('/decline/:id').put((req, res) => {
    Challenge.findById(req.params.id)
        .then(challenge => {
            challenge.homeScore = req.body.homeScore;
            challenge.awayScore = req.body.awayScore;
            challenge.status = "Declined";

            challenge.save()
                .then(() => res.json(challenge))
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

module.exports = router;