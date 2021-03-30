import React from 'react'
import auth from './auth';

const Messages = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }
    return (
        <div>

        </div>
    )
}

export default Messages
