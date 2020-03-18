import React, { Component } from 'react';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './components/main';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import EditPost from './components/EditPost';
import "bootstrap/dist/css/bootstrap.min.css"

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
              <Link to="/">Duels</Link>
              <Link to="/">Déconnexion</Link>
            </Navigation>
          </Header>
          <Drawer title="Bienvenue Admin">
            <Navigation>
              <Link to="/competitions">Championnats</Link>
              <Link to="/players">Membres</Link>
              <Link to="/">Duels</Link>
              <Link to="/">Déconnexion</Link>
            </Navigation>
          </Drawer>
          <Content>
            <Router>
              <Route path="/edit/:id" component={EditPost} />
            </Router>
            <div className="page-content" />
            <Main />
          </Content>
        </Layout>
      </div>
    )
  }
}

export default App;
