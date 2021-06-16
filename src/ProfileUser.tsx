import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import auth from './auth';
import PublicationsList from './PublicationsList';

const ProfileUser = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    let token = localStorage.getItem('token');

    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [biography, setBiography] = useState('')
    const [userId, setUserId] = useState<number | null>(null);
    const [showPublications, setShowPublications] = useState(false);

    const getUser = () => {
        let aux = window.location.pathname.substring(13);
        console.log(aux, token);
        if (aux !== null && token !== null) {
            setUserId(parseInt(aux));
            if (userId === null) return;
            setShowPublications(true);
            fetch(`http://localhost:8081/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => {
                if (res.status === 200) {
                    if (res.json.length != 0)
                        res.json().then((resp) => {
                            console.log(res);
                            setUsername(resp.username === null ? '' : resp.username);
                            setFirstname(resp.firstname === null ? '' : resp.firstname);
                            setLastname(resp.lastname === null ? '' : ' ' + resp.lastname);
                            setBiography(resp.biography === null ? '' : resp.biography);
                        });
                    else {
                        window.location.href = '/errorPage'
                    }
                } else {
                    console.log(res.statusText);
                }
            })
        }
    }

    useEffect(() => {

        getUser();
    }, [userId])

    return (
        <div className='container'>
            <Row>
                <Col md={{ span: 6 }}>
                    <img className='float-right' src="https://blog.cpanel.com/wp-content/uploads/2019/08/user-01.png" alt="user" width='30%' height='auto' />
                </Col>
                <Col md={{ span: 4 }} >
                    <div className='float-right'>
                        <h2>{username}</h2>
                        <h3>{firstname + lastname}</h3>
                        <h5>{biography}</h5>
                    </div>
                </Col>
            </Row>
            <br />
            <br />
            {showPublications ? <Row><PublicationsList url={`http://localhost:8081/api/publications/users/${userId}`} /></Row> : undefined}

        </div >
    )
}

export default ProfileUser
