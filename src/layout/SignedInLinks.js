import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedInLinks = () => {
    return (
        <ul className="right">
            <li><NavLink to='/competitions'>Championnats</NavLink></li>
            <li><NavLink to='/players'>Joueurs</NavLink></li>
            <li><NavLink to='/' className='btn btn-floating pink lighten-1'>Logout</NavLink></li>
        </ul>
    )
}

export default SignedInLinks;