import React from 'react'
import auth from './auth';

const Explore = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }
    return (
        <div>

        </div>
    )
}

export default Explore
