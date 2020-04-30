const router = require('express').Router();
const config = require('config');
const jwt = require('jsonwebtoken');
let Player = require('../models/player.model');
let Match = require('../models/match.model');
let Bet = require('../models/bet.model');
let Duel = require('../models/duel.model');
let Challenge = require('../models/challenge.model');


router.route('/').get((req, res) => {
    Player.find()
        .then(Players => res.json(Players))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Player.find({ username: req.params.id }).populate('bet')
        .then(Player => res.json(Player))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/player/:id').get((req, res) => {
    Player.findById(req.params.id).then(Player => res.json(Player))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/delete/:id').delete((req, res) => {
    Player.findByIdAndDelete(req.params.id)
        .then(() => res.json('Player deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const { body } = req;
    let { username, password, coins } = body;

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
        if (coins !== null || coins !== undefined) {
            newPlayer.coins = coins;
        }
        newPlayer.save().then(player => {
            jwt.sign(
                { id: newPlayer._id },
                config.get("jwtSecret"),
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        player: newPlayer
                    });
                }

            )
        })
    })
});

router.route('/addBet/:id').post((req, res) => {
    const { match, homeScore, awayScore, winner, betting } = req.body;

    Player.findById(req.params.id)
        .then(player => {
            const bet = new Bet({
                player: new Player(player), match: new Match(match),
                homeScore, awayScore, winner, betting
            });

            player.coins = player.coins - betting;
            player.bet.push(bet);

            bet.save().then(b => {
                player.save();
                res.json(b);
            }).catch(err => res.status(400).json('Error: ' + err));
        })
});


router.route('/addDuel/:id').post((req, res) => {
    const { opponent, match, homeScore, awayScore, betting, status } = req.body;

    Player.findById(req.params.id)
        .then(player => {
            const player2 = new Player(opponent);

            const challenger = new Challenge({
                opponent: player2, homeScore, awayScore, betting, status
            });
            const challenged = new Challenge({
                opponent: new Player(player), homeScore: 0, awayScore: 0, betting, status: "Received"
            });

            const duel = new Duel({ challenger, challenged, match: new Match(match) });

            //player.duel.push(duel);
            //player2.duel.push(duel);

            duel.save().then(d => {
                //player.save();
                challenger.save();
                challenged.save();
                res.json(d);
            }).catch(err => res.status(400).json('Error: ' + err));
        })
});

router.route("/addDuelPlayer2/:id").post((req, res) => {
    const { duel } = req.body;

    Player.findById(req.params.id)
        .then(player => {

            player.duel.push(new Duel(duel));

            player.save().then(p => res.json(p));
        })
});

module.exports = router;