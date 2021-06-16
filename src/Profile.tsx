import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import auth from './auth';
import PublicationsList from './PublicationsList';

const Profile = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    let token = localStorage.getItem('token');

    const [username, setUsername] = useState('');
    const [userPublic, setUserPublic] = useState<boolean | null>(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [biography, setBiography] = useState('')
    const [userId, setUserId] = useState<number | null>(null);
    const [showPublications, setShowPublications] = useState(false);
    const [showConfig, setShowConfig] = useState(false);

    const getUser = () => {
        let aux = localStorage.getItem('userId');
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
                    res.json().then((resp) => {
                        console.log(res);
                        setUsername(resp.username === null ? '' : resp.username);
                        setFirstname(resp.firstname === null ? '' : resp.firstname);
                        setLastname(resp.lastname === null ? '' : ' ' + resp.lastname);
                        setBiography(resp.biography === null ? '' : resp.biography);
                        setUserPublic(resp.public);
                    });
                } else {
                    console.log(res.statusText);
                }
            })
        }
    }

    const config = () => {
        setShowConfig(!showConfig);
        setShowPublications(!showPublications);
    }

    const changePublic = () => {
        if (token !== null) {
            fetch('http://localhost:8081/api/users', {
                method: 'PUT',
                body: JSON.stringify({ public: !userPublic }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then(async (res) => {
                if (res.status === 200) {
                    if (userPublic !== null)
                        setUserPublic(!userPublic);
                } else {
                    let resp = await res.json();
                    console.log(resp.message);
                    console.log(res.statusText);
                }
            });
        }
    }

    const deleteAccount = () => {
        if (token !== null) {
            fetch('http://localhost:8081/api/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then(async (res) => {
                if (res.status === 200) {
                    auth.logout();
                } else {
                    let resp = await res.json();
                    console.log(resp.message);
                    console.log(res.statusText);
                }
            });
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
                <Col >
                    <button className='btn float-right' onClick={() => config()}><FontAwesomeIcon icon={faCog}></FontAwesomeIcon></button>
                </Col>
            </Row>
            <br />
            <br />
            {showPublications ? <Row><PublicationsList url={`http://localhost:8081/api/publications/users/${userId}`} /></Row> : undefined}
            {showConfig ? <div>
                <Row>
                    <Col className='text-center'><h4 >Public Profile <button className='btn' onClick={() => changePublic()}>{userPublic ? <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> : <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}</button></h4></Col>
                </Row>
                <Row>
                    <Col className='text-center'><h4>Delete Account <button className='btn' onClick={() => deleteAccount()}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button></h4></Col>
                </Row>
            </div> : undefined
            }


        </div >
    )
}

export default Profile
