import React, { Component } from 'react';
import { Modal, ModalBody, Alert } from 'react-bootstrap';
import axios from 'axios';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
            coins: '',
            msg: null
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
            .then(res => {
                this.props.onClose(res.data.player)
                this.setState({
                    msg: null
                })
            })
            .catch(err => this.setState({
                msg: err.response.data.msg
            }))
            .then(() => {
                if (this.state.msg == null) {
                    this.props.onHide();
                    this.setState({
                        username: '',
                        password: '',
                        coins: '',
                        msg: null
                    })
                }
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
                            <div className="errors">{this.state.msg ? <Alert variant='danger'>{this.state.msg}</Alert> : null}</div>
                            <div className="form-group">
                                <label>Username: </label>
                                <input ref="username"
                                    required className="form-control" value={this.state.username}
                                    onChange={this.onChangeUsername} />
                                <label>Password: </label>
                                <input ref="password"
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