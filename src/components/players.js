import React, { PureComponent } from 'react';
import CreatePlayer from './createPlayer';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';
import Button from 'react-bootstrap/Button'

let players = [];

class Players extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            editPostShow: false
        };
        this.deletePlayer = this.deletePlayer.bind(this);
        this.updatePlayer = this.updatePlayer.bind(this);
    }

    async componentDidMount() {
        await axios.get(`http://localhost:5000/players`)
            .then(res => {
                players.push(...res.data);
            })
        this.setState({
            players: players
        })
        players = [];
    }

    updatePlayer(player) {
        let newArray = [];
        const playerIndex = this.state.players.findIndex(data => data.username === player.username);
        if (playerIndex === -1) {
            newArray = this.state.players;
            console.log(newArray);
            newArray.push(player);
        } else {
            newArray = [
                // destructure all items from beginning to the indexed item
                ...this.state.players.slice(0, playerIndex),
                // add the updated item to the array
                player,
                // add the rest of the items to the array from the index after the replaced item
                ...this.state.players.slice(playerIndex + 1)
            ]
        }
        this.setState({ players: newArray })
    }

    deletePlayer(id) {
        axios.delete('http://localhost:5000/players/delete/' + id)
        const filteredPlayers = this.state.players.filter(player => player._id !== id);
        this.setState({
            players: filteredPlayers
        })
    }

    render() {
        let createPlayerClose = () => { this.setState({ createPlayerShow: false }) };
        const playersList = this.state.players.map(player => {
            return (
                <div className="list" key={player._id}>
                    <p>
                        {player.username} -           Coins : {player.coins}
                        <span>
                            <FontAwesomeIcon className="faiconsTrash" icon='trash'
                                onClick={() => { this.deletePlayer(player._id) }} />
                            <FontAwesomeIcon className="faiconsPen" icon='pen'
                                onClick={() => console.log("edit player")} />
                        </span>
                    </p>
                </div>
            )
        })
        return (
            <div>
                <div className="createDiv">
                    <Button className="create" variant="dark" onClick={() => this.setState({ createPlayerShow: true })}>Create Player</Button>
                </div>
                <section className="projects-grid">
                    <div className="back">
                        {playersList}
                    </div>
                </section>
                <CreatePlayer show={this.state.createPlayerShow}
                    onClose={player => this.updatePlayer(player)} onHide={createPlayerClose} />
            </div>
        )
    }
}

export default Players;