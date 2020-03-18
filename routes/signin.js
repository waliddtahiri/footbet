const router = require('express').Router();
let Player = require('../models/player.model');
let PlayerSession = require('../models/playerSession');

router.route('/signup').post((req, res) => {
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

router.route('/signin').post((req, res) => {
    const { body } = req;
    const { password } = body;
    let { username } = body;

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
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: server error'
            });
        }
        if (users.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        }

        //otherwise correct user
        const playerSession = new PlayerSession();
        playerSession.userId = user._id;
        playerSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }

            return res.send({
                success: true,
                message: 'Valid sign in',
                player: user,
                token: doc._id
            });
        });
    });
});

router.route('/verify').get((req, res) => {
    // Get the token
    const { query } = req;
    const { token } = query;

    //?token=test

    // Verify the token is unique and not deleted
    PlayerSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }

        if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            });
        } else {
            return res.send({
                success: true,
                message: 'Good'
            });
        }
    })
});

router.route('/logout').get((req, res) => {
    // Get the token
    const { query } = req;
    const { token } = query;

    //?token=test

    // Verify the token is unique and not deleted
    PlayerSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: { isDeleted: true }
    }, null, (err) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }

        return res.send({
            success: true,
            message: 'Good'
        });
    });
});


module.exports = router;
