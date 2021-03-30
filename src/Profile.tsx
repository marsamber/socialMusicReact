import React from 'react'
import auth from './auth';

const Profile = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }
    return (
        <div>

        </div>
    )
}

export default Profile
