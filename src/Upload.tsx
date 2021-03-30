import React from 'react'
import auth from './auth';

const Upload = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }
    return (
        <div>

        </div>
    )
}

export default Upload
