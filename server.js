const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://walidfoot:walidfoot@cluster0-aksbw.gcp.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
});

const playerRouter = require('./routes/players');
const authRouter = require('./routes/auth');
const matchRouter = require('./routes/matches');
const competitionRouter = require('./routes/competitions');
const challengeRouter = require('./routes/challenges');
const betRouter = require('./routes/bets');
const duelRouter = require('./routes/duel');
const signinRouter = require('./routes/signin');

app.use('/players', playerRouter);
app.use('/auth', authRouter);
app.use('/matches', matchRouter);
app.use('/competitions', competitionRouter);
app.use('/bets', betRouter);
app.use('/duels', duelRouter);
app.use('/account', signinRouter);
app.use('/challenges', challengeRouter);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});