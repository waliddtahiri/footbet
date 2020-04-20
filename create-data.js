const mongoose = require('mongoose');
let Player = require('./models/player.model');
let Match = require('./models/match.model');
let Competition = require('./models/competition.model');
const axios = require('axios');

const MONGO_URL = 'mongodb+srv://walidfoot:walidfoot@cluster0-aksbw.gcp.mongodb.net/test?retryWrites=true&w=majority';

const matches = (competitionAPI) => {
    try {
        return axios({
            method: 'get',
            url: `http://api.football-data.org/v2/competitions/${competitionAPI}/matches/?matchday=22`,
            dataType: 'json',
            headers: { 'X-Auth-Token': '6466a049243a4bf289e2a209abfe620e' }
        })
    }
    catch (error) {
        console.error(error)
    }
}

const setCompetitionAndMatchs = async () => {

    try {

        const db = await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

        await db.connection.dropDatabase();

        const competitionSA = new Competition({ name: 'Serie A' });
        const competitionLiga = new Competition({ name: 'Liga' });
        const competitionPL = new Competition({ name: 'Premier League' });
        const competitionBL = new Competition({ name: 'BundesLiga' });
        const competitionCL = new Competition({ name: 'Champions League' });

        const joueur1 = new Player();
        joueur1.username = "walid";
        joueur1.password = joueur1.generateHash("walid");
        joueur1.coins = 777;

        let playersArray = [];
        playersArray.push(joueur1);

        const allCompetitions = [competitionSA, competitionLiga, competitionPL, competitionBL];

        const setMatches = async (comp, i) => {
            try {
                matches(comp).then(async (res) => {
                    const matchCount = res.data.matches.length;
                    const competition = allCompetitions[i];
                    let matchsArray = [];

                    for (let j = 0; j < matchCount; ++j) {
                        const homeTeam = res.data.matches[j].homeTeam.name;
                        const awayTeam = res.data.matches[j].awayTeam.name;
                        const homeScore = res.data.matches[j].score.fullTime.homeTeam;
                        const awayScore = res.data.matches[j].score.fullTime.awayTeam;

                        const newMatch = new Match({ homeTeam, awayTeam, homeScore, awayScore, competition });

                        matchsArray.push(newMatch);

                        competition.matchs.push(newMatch);
                    }
                    await competition.save();
                    await Match.create(matchsArray);
                })
            }
            catch (err) {
                return `ERROR: ${err}`;
            }
        }

        await setMatches('SA', 0);
        await setMatches('PD', 1);
        await setMatches('PL', 2);
        await setMatches('BL1', 3);

        await Player.create(playersArray);

        await Competition.insertMany([competitionSA, competitionLiga, competitionPL,
            competitionBL, competitionCL]);

    }
    catch (err) {
        return `ERROR: ${err}`;
    }
}

setCompetitionAndMatchs().then(res => console.log(res));;


