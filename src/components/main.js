import React from 'react';

import Competitions from './competitions';
import Players from './players';
import { Switch, Route } from 'react-router-dom';

const Main = () => (
    <Switch>
        <Route exact path="/" />
        <Route path="/competitions" component={Competitions} />
        <Route path="/players" component={Players} />
    </Switch>
)

export default Main;