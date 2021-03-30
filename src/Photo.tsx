import React, { useEffect } from 'react'
import auth from './auth';

const Photo = () => {

    const getPublication = () => {

    }

    useEffect(() => {
        getPublication();
    }, [])

    if (!auth.isLogged()) {
        window.location.href = '/';
    }
    let url = window.location.pathname;
    url = url.substring(1);
    return (
        <div>
            <p>{url}</p>
        </div>
    )
}

export default Photo
