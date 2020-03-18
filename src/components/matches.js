import React, { Component } from 'react';
import axios from 'axios';

class Matches extends Component {
    componentDidMount() {
        axios({
            method: 'get',
            url: 'http://api.football-data.org/v2/competitions/SA/matches/?matchday=20',
            dataType: 'json',
            headers: { 'X-Auth-Token': '6466a049243a4bf289e2a209abfe620e' }
        }).then(res => {
            console.log(res)
            console.log(res.data.matches[2].homeTeam)
            console.log(res.data.matches[2].awayTeam)
            console.log(res.data.matches[2].score.fullTime.homeTeam + " - " + 
            res.data.matches[2].score.fullTime.awayTeam)

            const homeTeam = res.data.matches[1].homeTeam;
            const awayTeam = res.data.matches[1].awayTeam;

        })
    }
    render() {
        return (
            <div className="container">
                <p></p>
            </div>
        )
    }
}

export default Matches;