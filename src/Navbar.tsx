import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Links from './Links';
import Home from './Home';
import Profile from './Profile';
import Messages from './Messages';
import Explore from './Explore';
import Upload from './Upload';
import Publication from './Publication'
import Error from './Error';

const Navbar = () => {
    return (
        <Router>
            <Links />
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route path='/profile'>
                    <Profile />
                </Route>
                <Route path='/messages'>
                    <Messages />
                </Route>
                <Route path='/messages'>
                    <Messages />
                </Route>
                <Route path='/explore'>
                    <Explore />
                </Route>
                <Route path='/upload'>
                    <Upload />
                </Route>
                <Route path='/:id'>
                    <Publication />
                </Route>
                <Route path='*'>
                    <Error />
                </Route>
            </Switch>
        </Router>
    )
}

export default Navbar
