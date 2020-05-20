import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Button from 'react-bootstrap/Button'
import { Tabs, Tab } from 'react-mdl';
import axios from 'axios';
import './styles.css';
import PostsList from './PostsList'

let allCompetitions = [];
let SA = [];
let Liga = [];
let PL = [];
let BL = [];

class Competitions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0, postsSA: [], postsLiga: [], postsPL: [], postsBL: [], selectedIndex: 'Journée 1',
            allMatchesSA: [], allMatchesLiga: [], allMatchesPL: [], allMatchesBL: []
        };
        this.deleteMatch = this.deleteMatch.bind(this);
        this.updateMatch = this.updateMatch.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
    }

    async componentDidMount() {
        await axios.get('http://localhost:5000/competitions/all')
            .then(res => {
                allCompetitions.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[0]}`)
            .then(res => {
                SA.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[1]}`)
            .then(res => {
                Liga.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[2]}`)
            .then(res => {
                PL.push(...res.data);
            })
        await axios.get(`http://localhost:5000/competitions/${allCompetitions[3]}`)
            .then(res => {
                BL.push(...res.data);
            })
        let duels = [];
        await axios.get('http://localhost:5000/duels').then(res => duels.push(...res.data));

        this.setState({
            allMatchesSA: SA,
            allMatchesLiga: Liga,
            allMatchesPL: PL,
            allMatchesBL: BL
        })

        let bets = [];
        // axios.get('http://localhost:5000/players/getBets/5eb70c44ededc82e6c864846')
        // .then(res => {
        //     let pari = undefined;
        //     res.data.forEach(async (bet) => {
        //         await axios.get(`http://192.168.0.239:5000/bets/${bet._id}`).then(res => pari = res.data);
        //         console.log(pari);
        //         if (pari.match.winner === "unknown") {
        //             bets.push(pari);
        //         }
        //     })
        // })

        this.setPosts(1);

        allCompetitions = [];
        SA = [];
        Liga = [];
        PL = [];
        BL = [];
    }

    setPosts(day) {
        let SA = [];
        let Liga = [];
        let PL = [];
        let BL = []

        this.state.allMatchesSA.forEach(match => {
            if (match.matchday == day) {
                SA.push(match);
            }
        });

        this.state.allMatchesLiga.forEach(match => {
            if (match.matchday == day) {
                Liga.push(match);
            }
        });

        this.state.allMatchesPL.forEach(match => {
            if (match.matchday == day) {
                PL.push(match);
            }
        });

        this.state.allMatchesBL.forEach(match => {
            if (match.matchday == day) {
                BL.push(match);
            }
        });

        this.setState({
            postsSA: SA,
            postsLiga: Liga,
            postsPL: PL,
            postsBL: BL
        })
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
    }

    async updateScores() {
        let SA = [];
        let PD = [];
        let PL = [];
        let BL1 = [];
        let duels = [];

        const competitions = ['SA', 'PD', 'PL', 'BL1'];
        const competitionsArray = [SA, PD, PL, BL1];

        const { postsSA, postsLiga, postsPL, postsBL } = this.state;

        const posts = [postsSA, postsLiga, postsPL, postsBL];

        for (let i = 0; i < competitions.length; ++i) {
            await axios({
                method: 'get',
                url: `http://api.football-data.org/v2/competitions/${competitions[i]}/matches/?matchday=`
                    + this.state.selectedIndex.split("Journée ")[1],
                dataType: 'json',
                headers: { 'X-Auth-Token': '6466a049243a4bf289e2a209abfe620e' }
            }).then(res => {
                competitionsArray[i].push(...res.data.matches);
            })

            competitionsArray[i].forEach(match => {
                posts[i].forEach(async (m) => {
                    if (match.homeTeam.name == m.homeTeam && match.awayTeam.name == m.awayTeam) {
                        m.homeScore = match.score.fullTime.homeTeam;
                        m.awayScore = match.score.fullTime.awayTeam;
                        m.winner = match.score.winner;
                        await axios.put('http://localhost:5000/matches/update/' + m._id, m)
                            .catch(err => console.log(err.response.data.msg))
                        //console.log(m.homeTeam + " " + m.homeScore + "-" + m.awayScore + " " + m.awayTeam);
                    }
                })
            })
            this.setState({
                postsSA, postsLiga, postsPL, postsBL
            })
        }

        await axios.get('http://localhost:5000/duels').then(res => duels.push(...res.data));

        if (duels.length > 0) {
            duels.forEach(async (duel) => {
                console.log(duel);
                let d = undefined;
                let player1 = undefined;
                let player2 = undefined;
                let challenger = undefined;
                let challenged = undefined;

                await axios.get('http://localhost:5000/duels/' + duel._id).then(res => {
                    d = res.data
                });
                await axios.get('http://localhost:5000/challenges/' + d.challenger._id).then(res => {
                    challenger = res.data
                });
                await axios.get('http://localhost:5000/challenges/' + d.challenged._id).then(res => {
                    challenged = res.data
                });
                await axios.get('http://localhost:5000/players/player/' + challenged.opponent).then(res => {
                    player1 = res.data
                });
                await axios.get('http://localhost:5000/players/player/' + challenger.opponent).then(res => {
                    player2 = res.data
                });

                let diffChallenger = Math.abs(d.challenger.homeScore - d.challenger.awayScore);
                let diffChallenged = Math.abs(d.challenged.homeScore - d.challenged.awayScore);
                let diffMatch = Math.abs(d.match.homeScore - d.match.awayScore);

                console.log(diffChallenger);
                console.log(diffChallenged);
                console.log(challenged);

                if (challenged.status != "Accepted") {
                    player1.coins = player1.coins + challenger.betting;
                    await axios.delete('http://localhost:5000/duels/delete/' + duel._id);
                    await axios.put('http://localhost:5000/players/update/' + player1._id, player1);
                } else {
                    if (d.challenger.homeScore == d.match.homeScore && d.challenger.awayScore == d.match.awayScore) {
                        d.winner = player1.username;
                        player1.coins = player1.coins + d.challenger.betting * 2
                    } else if (d.challenged.homeScore == d.match.homeScore && d.challenged.awayScore == d.match.awayScore) {
                        d.winner = player2.username;
                        player2.coins = player2.coins + d.challenged.betting * 2
                    }

                    if (diffChallenger == diffMatch || diffChallenged == diffMatch) {
                        if (diffChallenger == diffMatch && diffChallenged != diffMatch) {
                            d.winner = player1.username;
                            player1.coins = player1.coins + d.challenger.betting * 2
                        } else if (diffChallenged == diffMatch && diffChallenger != diffMatch) {
                            d.winner = player2.username;
                            player2.coins = player2.coins + d.challenged.betting * 2
                        }
                    }

                    if (diffChallenger != diffMatch && diffChallenged != diffMatch) {
                        if (Math.abs(diffMatch - diffChallenger) < Math.abs(diffMatch - diffChallenger)) {
                            d.winner = player1.username;
                            player1.coins = player1.coins + challenger.betting * 2
                        } else if (Math.abs(diffMatch - diffChallenger) > Math.abs(diffMatch - diffChallenger)) {
                            d.winner = player2.username;
                            player2.coins = player2.coins + challenged.betting * 2
                        } else {
                            if (Math.abs(d.challenger.homeScore - d.match.homeScore) <
                                Math.abs(d.challenged.homeScore - d.match.homeScore)) {
                                d.winner = player1.username;
                                player1.coins = player1.coins + challenger.betting * 2
                            } else if (Math.abs(d.challenged.homeScore - d.match.homeScore) <
                                Math.abs(d.challenger.homeScore - d.match.homeScore)) {
                                d.winner = player2.username;
                                player2.coins = player2.coins + challenged.betting * 2
                            } else {
                                d.winner = "DRAW"
                                player1.coins = player1.coins + challenger.betting
                                player2.coins = player1.coins + challenger.betting
                            }
                        }
                    }
                    await axios.put('http://localhost:5000/duels/update/' + duel._id, d);
                    await axios.put('http://localhost:5000/players/update/' + player1._id, player1);
                    await axios.put('http://localhost:5000/players/update/' + player2._id, player1);
                }
            })
        }
        console.log("Scores Updated")
    }

    toggleCategories() {
        const options = [];
        for (let i = 0; i < 20; ++i) {
            options.push('Journée ' + (i + 1));
        }
        const { selectedIndex } = this.state;
        if (this.state.activeTab === 0) {
            return (
                <div>
                    <div className="choose">
                        <Dropdown options={options} onChange={async (day) => {
                            await this.setState({ selectedIndex: day.value });
                            this.setPosts(this.state.selectedIndex.split("Journée ")[1]);
                        }}
                            value={selectedIndex} placeholder="Select an option" />
                        <Button className="create" variant="dark"
                            onClick={() => this.updateScores()}>Update scores</Button>
                    </div>
                    <div className="back">
                        <PostsList posts={this.state.postsSA} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch} />
                    </div>
                </div>
            )
        }
        if (this.state.activeTab === 1) {
            return (
                <div>
                    <div className="choose">
                        <Dropdown options={options} onChange={async (day) => {
                            await this.setState({ selectedIndex: day.value });
                            this.setPosts(this.state.selectedIndex.split("Journée ")[1]);
                        }}
                            value={selectedIndex} placeholder="Select an option" />
                        <Button className="create" variant="dark"
                            onClick={() => this.updateScores()}>Update scores</Button>
                    </div>
                    <div className="back"><PostsList posts={this.state.postsLiga} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch} /></div>
                </div>
            )
        }
        if (this.state.activeTab === 2) {
            return (
                <div>
                    <div className="choose">
                        <Dropdown options={options} onChange={async (day) => {
                            await this.setState({ selectedIndex: day.value });
                            this.setPosts(this.state.selectedIndex.split("Journée ")[1]);
                        }}
                            value={selectedIndex} placeholder="Select an option" />
                        <Button className="create" variant="dark"
                            onClick={() => this.updateScores()}>Update scores</Button>
                    </div>
                    <div className="back"><PostsList posts={this.state.postsPL} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch} /></div>
                </div>
            )
        }
        if (this.state.activeTab === 3) {
            return (
                <div>
                    <div className="choose">
                        <Dropdown options={options} onChange={async (day) => {
                            await this.setState({ selectedIndex: day.value });
                            this.setPosts(this.state.selectedIndex.split("Journée ")[1]);
                        }}
                            value={selectedIndex} placeholder="Select an option" />
                        <Button className="create" variant="dark"
                            onClick={() => this.updateScores()}>Update scores</Button>
                    </div>
                    <div className="back"><PostsList posts={this.state.postsBL} deleteMatch={this.deleteMatch} updateMatch={this.updateMatch} /></div>
                </div>
            )
        }
    }

    updateMatch(posts, post) {
        let newArray = [];
        if (posts === this.state.postsSA) {
            const postIndex = this.state.postsSA.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsSA.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsSA.slice(postIndex + 1)
            ]
            this.setState({ postsSA: newArray })
        }
        if (posts === this.state.postsLiga) {
            const postIndex = this.state.postsLiga.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsLiga.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsLiga.slice(postIndex + 1)
            ]
            this.setState({ postsLiga: newArray })
        }
        if (posts === this.state.postsPL) {
            const postIndex = this.state.postsPL.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsPL.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsPL.slice(postIndex + 1)
            ]
            this.setState({ postsPL: newArray })
        }
        if (posts === this.state.postsBL) {
            const postIndex = this.state.postsBL.findIndex(data => data._id === post._id);
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.postsBL.slice(0, postIndex),
                // add the updated item to the array
                post,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.postsBL.slice(postIndex + 1)
            ]
            this.setState({ postsBL: newArray })
        }
    }

    deleteMatch(posts, id) {
        axios.delete('http://localhost:5000/matches/' + id)
        if (posts === this.state.postsSA) {
            const filteredMatchesSA = this.state.postsSA.filter(match => match._id !== id);
            this.setState({
                postsSA: filteredMatchesSA
            })
        }
        if (posts === this.state.postsLiga) {
            const filteredMatchesLiga = this.state.postsLiga.filter(match => match._id !== id);
            this.setState({
                postsLiga: filteredMatchesLiga
            })
        }
        if (posts === this.state.postsPL) {
            const filteredMatchesPL = this.state.postsPL.filter(match => match._id !== id);
            this.setState({
                postsPL: filteredMatchesPL
            })
        }
        if (posts === this.state.postsBL) {
            const filteredMatchesBL = this.state.postsBL.filter(match => match._id !== id);
            this.setState({
                postsBL: filteredMatchesBL
            })
        }
    }

    render() {
        return (
            <div className="competitions-tabs">
                <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
                    <Tab>Serie A</Tab>
                    <Tab>Liga</Tab>
                    <Tab>Premier League</Tab>
                    <Tab>BundesLiga</Tab>
                </Tabs>
                <section className="projects-grid">
                    {this.toggleCategories()}
                </section>
            </div>
        )
    }
}

export default Competitions;