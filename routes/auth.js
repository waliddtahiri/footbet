const router = require('express').Router();
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

let Player = require('../models/player.model');
let Match = require('../models/match.model');


router.get('/player', auth, (req, res) => {
    Player.findById(req.player.id)
        .select('-password')
        .then(player => res.json(player));
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

router.post('/signup', (req, res) => {
    const { body } = req;
    let { username, password } = body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if(username.length < 5){
        return res.status(400).json({ msg: 'Username must have 5 characters' });
    }

    if(password.length < 5){
        return res.status(400).json({ msg: 'Password must have 5 characters' });
    }

    Player.findOne({ username })
        .then(player => {
            if (player) return res.status(400).json({ msg: 'User already exists' });

            const newPlayer = new Player({
                username,
                password,
                coins: 500
            });

            newPlayer.password = newPlayer.generateHash(password);
            newPlayer.save().then( player => {
                jwt.sign(
                    { id: player._id },
                    config.get("jwtSecret"),
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            player
                        });
                    }
                )
            })
        })
});

router.post('/login', (req, res) => {
    const { body } = req;
    let { username, password } = body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    Player.findOne({ username })
        .then(player => {
            if (!player) return res.status(400).json({ msg: 'User does not exist' });

            bcrypt.compare(password, player.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
                    jwt.sign(
                        { id: player._id },
                        config.get("jwtSecret"),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                player
                            });
                        }
                    )
                })
        })

});

router.post('/loginAdmin', (req, res) => {
    const { body } = req;
    let { username, password } = body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    Player.findOne({ username })
        .then(player => {
            if (!player) return res.status(400).json({ msg: 'User does not exist' });

            bcrypt.compare(password, player.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
                    if (player.admin == false) return res.status(400).json({ msg: 'No admin rights' });
                    jwt.sign(
                        { id: player._id },
                        config.get("jwtSecret"),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                player
                            });
                        }
                    )
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
});

module.exports = router;