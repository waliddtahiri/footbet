import React, { Component } from 'react';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import Navbar from './layout/Navbar';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Main from './components/main';
import Competitions from './components/competitions';
import Players from './components/players';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import EditPost from './components/EditPost';
import "bootstrap/dist/css/bootstrap.min.css";

library.add(faTrash);
library.add(faPen);

class App extends Component {
  render() {
    return (
      <div className="demo-big-content">
        <Layout>
          <Header title="Bienvenue Admin" scroll>
            <Navigation>
              <Link to="/competitions">Championnats</Link>
              <Link to="/players">Joueurs</Link>
              <Link to="/">Déconnexion</Link>
            </Navigation>
          </Header>
          <Drawer title="Bienvenue Admin">
            <Navigation>
              <Link to="/competitions">Championnats</Link>
              <Link to="/players">Membres</Link>
              <Link to="/">Déconnexion</Link>
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
      // <Router>
      //   <div className="App">
      //     <Navbar />
      //     <Content>
      //       <Router>
      //         <Route path="/edit/:id" component={EditPost} />
      //       </Router>
      //       <div className="page-content" />
      //       <Main />
      //     </Content>
      //   </div>
      // </Router>
    )
  }
}

export default App;
