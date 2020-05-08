import React from 'react';

import Competitions from './competitions';
import Players from './players';
import { Router, Route } from 'react-router-dom';

const Main = () => (
    <Router>
        <Route exact path="/" />
        <Route path="/competitions" component={Competitions} />
        <Route path="/players" component={Players} />
    </Router>
)

export default Main;