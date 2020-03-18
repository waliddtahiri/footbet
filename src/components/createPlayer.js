import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

class CreatePlayer extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeCoins = this.onChangeCoins.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            password: '',
            coins: ''
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeCoins(e) {
        this.setState({
            coins: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const player = {
            username: this.state.username,
            password: this.state.password,
            coins: this.state.coins
        }

        console.log(player);

        axios.post('http://localhost:5000/players/add', player)
             .then(res => console.log(res));

        this.props.onHide();

        this.setState({
            username: '',
            password: '',
            coins: ''
        })
    }

    render() {
        return (
            <Modal {...this.props} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Username: </label>
                                <input ref="username"
                                    required className="form-control" value={this.state.username}
                                    onChange={this.onChangeUsername} />
                                <label>Password: </label>
                                <input ref="âssword"
                                    required className="form-control" value={this.state.password}
                                    onChange={this.onChangePassword} />
                                <label>Coins: </label>
                                <input ref="coins"
                                    required className="form-control" value={this.state.coins}
                                    onChange={this.onChangeCoins} />
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Create Player" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default CreatePlayer;