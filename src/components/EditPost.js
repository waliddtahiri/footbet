import React, { Component } from 'react';
import { Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.onChangeHomeScore = this.onChangeHomeScore.bind(this);
        this.onChangeAwayScore = this.onChangeAwayScore.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            homeScore: '',
            awayScore: '',
            msg: null
        }
    }

    onChangeHomeScore(e) {
        this.setState({
            homeScore: e.target.value,
            msg: null
        });
    }

    onChangeAwayScore(e) {
        this.setState({
            awayScore: e.target.value,
            msg: null
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const match = {
            homeScore: this.state.homeScore,
            awayScore: this.state.awayScore
        }

        if (this.props.post._id !== null) {
            axios.put('http://localhost:5000/matches/update/' + this.props.post._id, match)
                .then(res => {
                    this.props.onClose(res.data)
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
                            homeScore: '',
                            awayScore: '',
                            msg: null
                        })
                    }
                })
        }
    }

    render() {
        const {homeTeam} = this.props.post;
        const {awayTeam} = this.props.post;
        return (
            <Modal {...this.props} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit score</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="errors">{this.state.msg ? <Alert variant='danger'>{this.state.msg}</Alert> : null}</div>
                            <div className="form-group">
                                <label>{homeTeam} : </label>
                                <input ref="matchInput"
                                    required className="form-control" value={this.state.homeScore}
                                    onChange={this.onChangeHomeScore} />
                                <br/>
                                <label>{awayTeam} : </label>
                                <input ref="matchInput"
                                    required className="form-control" value={this.state.awayScore}
                                    onChange={this.onChangeAwayScore} />
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Edit Match" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default EditPost;