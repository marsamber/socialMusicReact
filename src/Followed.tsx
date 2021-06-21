import React from 'react'
import auth from './auth';
import PublicationsList from './PublicationsList'

const Followed = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }
    let userId = localStorage.getItem('userId');
    return (
        <div className='container'>
            <PublicationsList url='http://localhost:8081/api/publications/followed' />
        </div>
    )
}

export default Followed