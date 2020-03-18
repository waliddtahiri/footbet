import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

class EditPost extends Component {
    constructor(props) {
        super(props);

        this.onChangeHomeScore = this.onChangeHomeScore.bind(this);
        this.onChangeAwayScore = this.onChangeAwayScore.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            homeScore: ' ',
            awayScore: ' '
        }
    }

    onChangeHomeScore(e) {
        this.setState({
            homeScore: e.target.value
        });
    }

    onChangeAwayScore(e) {
        this.setState({
            awayScore: e.target.value
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
                .then(res => this.props.onClose(res.data));

            this.props.onHide();

            this.setState({
                    homeScore: ' ',
                    awayScore: ' '
            })
        }
    }

    render() {
        return (
            <Modal {...this.props} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit score</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Score Domicile: </label>
                                <input ref="matchInput"
                                    required className="form-control" value={this.state.homeScore}
                                    onChange={this.onChangeHomeScore} />
                                <label>Score Extérieur: </label>
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