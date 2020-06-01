const mongoose = require('mongoose');
let Player = require('./models/player.model');
let Match = require('./models/match.model');
let Competition = require('./models/competition.model');
const axios = require('axios');

const MONGO_URL = 'mongodb+srv://walidfoot:walidfoot@cluster0-aksbw.gcp.mongodb.net/test?retryWrites=true&w=majority';

const matches = (competitionAPI, matchday) => {
    try {
        return axios({
            method: 'get',
            url: `http://api.football-data.org/v2/competitions/${competitionAPI}/matches/?matchday=`
                + matchday,
            dataType: 'json',
            headers: { 'X-Auth-Token': '6466a049243a4bf289e2a209abfe620e' }
        })
    }
    catch (error) {
        console.error(error)
    }
}

const setCompetition = (competitionAPI) => {
    try {
        return axios({
            method: 'get',
            url: `http://api.football-data.org/v2/competitions/${competitionAPI}`,
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

        const joueur1 = new Player();
        joueur1.username = "walid";
        joueur1.password = joueur1.generateHash("walid");
        joueur1.admin = true;
        joueur1.coins = 777;

        await joueur1.save();

        const joueur2 = new Player();
        joueur2.username = "tony";
        joueur2.password = joueur1.generateHash("tony");
        joueur2.coins = 99999;

        await joueur2.save();

        const allCompetitions = [competitionSA, competitionLiga, competitionPL, competitionBL];

        const setMatches = (comp, i) => {
            try {
                for (let m = 1; m <= 5; m++) {
                    matches(comp, m).then(res => {
                        const competition = allCompetitions[i];
                        const matchCount = res.data.matches.length;
                        let matchsArray = [];

                        for (let j = 0; j < matchCount; ++j) {
                            const homeTeam = res.data.matches[j].homeTeam.name;
                            const awayTeam = res.data.matches[j].awayTeam.name;
                            const date = new Date(res.data.matches[j].utcDate);

                            const newMatch = new Match({
                                homeTeam, awayTeam, homeScore: 0,
                                awayScore: 0, competition, matchday: m, date, winner: 'unknown'
                            });

                            matchsArray.push(newMatch);

                            competition.matchs.push(newMatch);

                            newMatch.save();
                        }
                    })
                }        
            }
            catch (err) {
                return `ERROR: ${err}`;
            }
        }

        setMatches('SA', 0);
        setMatches('PD', 1);
        setMatches('PL', 2);
        setMatches('BL1', 3);

        setCompetition('SA').then(res => {
            competitionSA.seasons.push(...res.data.seasons);
            competitionSA.save();
        })
        setCompetition('PD').then(res => {
            competitionLiga.seasons.push(...res.data.seasons);
            competitionLiga.save();
        })
        setCompetition('PL').then(res => {
            competitionPL.seasons.push(...res.data.seasons);
            competitionPL.save();
        })
        setCompetition('BL1').then(res => {
            competitionBL.seasons.push(...res.data.seasons);
            competitionBL.save();
        })

        await Competition.insertMany([competitionSA, competitionLiga, competitionPL,
            competitionBL]);

    }
    catch (err) {
        return `ERROR: ${err}`;
    }
}

setCompetitionAndMatchs().then(res => console.log(res));;


