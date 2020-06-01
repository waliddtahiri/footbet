import React, { Component } from 'react';
import loginImg from "../../football-icon.jpg";

import { loginAdmin } from '../../actions/authActions';
import { Alert } from 'react-bootstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            token: '',
            signUpError: '',
            signInError: '',
            msg: null
        };

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.login = this.login.bind(this);
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            // check for login error
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
    }

    onChangeUsername(event) {
        this.setState({ 
            username: event.target.value,
            msg: null
         });
    }

    onChangePassword(event) {
        this.setState({ 
            password: event.target.value,
            msg: null
         });
    }

    login = () => {

        const username = this.state.username.toLowerCase();
        const password = this.state.password;

        // create user object
        const user = {
            username,
            password
        };

        // attempt to login
        this.props.loginAdmin(user);
    }

    render() {
        return (
            <div className="base-container">
                <div className="content">
                    <div className="image">
                        <img src={loginImg} />
                    </div>
                    <div className="errors">{ this.state.msg ? <Alert variant='danger'>{this.state.msg}</Alert> : null}</div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" onChange={this.onChangeUsername} value={this.state.username} name="username" placeholder="username" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" onChange={this.onChangePassword} value={this.state.password} name="password" placeholder="password" />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button onClick={this.login} type="button" className="btn">
                        Login
              </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { loginAdmin })(Login);