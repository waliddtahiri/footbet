import React, { Component } from 'react';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Competitions from './components/competitions';
import Players from './components/players';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import EditPost from './components/EditPost';
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.scss";
import { Login, Register } from "./components/login";

import { logout } from './actions/authActions';
import { connect } from 'react-redux';

library.add(faTrash);
library.add(faPen);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true
    };

    this.deconnexion = this.deconnexion.bind(this);
  }

  deconnexion() {
    console.log(this.props);
    this.props.logout();
  }

  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "login" : "register";
    return (
      !this.props.isAuthenticated == true ? (
        <div className="App">
          <div className="login">
            <div className="container">
                <Login />
            </div>
          </div>
        </div>) : (
          <div className="demo-big-content">
            <Layout>
              <Header title="Bienvenue Admin" scroll>
                <Navigation>
                  <Link to="/competitions">Championnats</Link>
                  <Link to="/players">Joueurs</Link>
                  <Link to="/" onClick={this.deconnexion}>Déconnexion</Link>
                </Navigation>
              </Header>
              <Drawer title="Bienvenue Admin">
                <Navigation>
                  <Link to="/competitions">Championnats</Link>
                  <Link to="/players">Membres</Link>
                  <Link to="/" onClick={this.deconnexion}>Déconnexion</Link>
                </Navigation>
              </Drawer>
              <Content>
                <Route exact path="/" />
                <Route path="/competitions" component={Competitions} />
                <Route path="/players" component={Players} />
                <Router>
                  <Route path="/edit/:id" component={EditPost} />
                </Router>
              </Content>
            </Layout>
          </div>
        )
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { logout })(App);
