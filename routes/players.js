const router = require('express').Router();
let Player = require('../models/player.model');
let Match = require('../models/match.model');

router.route('/').get((req, res) => {
    Player.find()
        .then(Players => res.json(Players))
        .catch(err => res.status(400).jsen('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Player.find({ username: req.params.id })
        .then(Player => res.json(Player))
        .catch(err => res.status(400).jsen('Error: ' + err))
});

router.route('/delete/:id').delete((req, res) => {
    Player.findByIdAndDelete(req.params.id)
        .then(() => res.json('Player deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const { body } = req;
    let { username, password } = body;

    if (!username) {
        return res.send({
            success: false,
            message: 'Error: Username cannot be blank.'
        })
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank.'
        })
    }

    username = username.toLowerCase();

    Player.find({
        username: username
    }, (err, previousUsers) => {
        if (err) {
            return res.send('Error: Server error')
        } else if (previousUsers.length > 0) {
            return res.send('Error: Account already exists')
        }

        //Save the new player
        const newPlayer = new Player();

        newPlayer.username = username;
        newPlayer.password = newPlayer.generateHash(password);
        newPlayer.save((err, user) => {
            if (err) {
                return res.send({
                    succes: false,
                    message: 'Error: Server error'
                });
            }
            return res.send({
                succes: true,
                message: 'Signed up'
            });
        })
    })
});

router.route('/update/:id').put((req, res) => {
    Player.findById(req.params.id)
        .then(player => {
            const bet = req.body.bet;
            const newBet = new Match(bet.homeTeam, bet.awayTeam, bet.homeScore, bet.awayScore);
            player.bet.push(newBet);

            player.save()
                .then(() => res.json(player))
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

module.exports = router;