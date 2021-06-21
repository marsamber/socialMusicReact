import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import auth from './auth';
import PublicationsList from './PublicationsList';
import defaultImageProfile from './defaultProfile.png';


const User = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    let token = localStorage.getItem('token');

    const [username, setUsername] = useState('');
    const [userPublic, setUserPublic] = useState(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [biography, setBiography] = useState('')
    const [userId, setUserId] = useState<number | null>(null);
    const [imgProfileSrc, setImgProfileSrc] = useState('');
    const [btnId, setBtnId] = useState('btn-in');
    const [btnMessage, setBtnMessage] = useState('Follow');


    const getUser = () => {
        let userId = window.location.pathname.substring(6);
        let me = localStorage.getItem('userId');
        if (userId !== null && token !== null && me != null) {
            if (userId === me)
                window.location.href = '/profile';
            setUserId(parseInt(userId));
            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('x-access-token', token);
            fetch(`http://localhost:8081/api/users/${userId}`, {
                headers: myHeaders
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((resp) => {
                        console.log(res);
                        setUsername(resp.username === null ? '' : resp.username);
                        setFirstname(resp.firstname === null ? '' : resp.firstname);
                        setLastname(resp.lastname === null ? '' : ' ' + resp.lastname);
                        setBiography(resp.biography === null ? '' : resp.biography);
                        setUserPublic(resp.public);
                        loadImgProfile(resp);
                        if (!resp.public) window.location.href = '/';

                        fetch(`http://localhost:8081/api/users/follow/followed/${me}`, {
                            method: 'GET',
                            headers: myHeaders
                        }).then((res) => {
                            if (res.status === 200) {
                                res.json().then((myFollowed) => {
                                    for (let i = 0; i < myFollowed.followed.length; i++) {
                                        if (parseInt(userId) === parseInt(myFollowed.followed[i].id)) {
                                            setBtnId('btn-out');
                                            setBtnMessage('Unfollow');
                                        }
                                    }
                                });
                            } else {
                                console.log(res.statusText);
                            }
                        }).catch((err) => console.log(err));
                    });
                } else {
                    console.log(res.statusText);
                    window.location.href = '/error';
                }
            });
        }
    }

    const loadImgProfile = (user: any) => {
        if (user.image !== null) {
            fetch(`http://localhost:8081/api/images/${user.image.id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (url) => {
                let image = await url.json();
                console.log(image)
                setImgProfileSrc(`data:${image.image.type};base64,${Buffer.from(image.imageData.data).toString('base64')}`);
            });
        } else if (user.urlImg !== null) {
            setImgProfileSrc(user.urlImg);

        } else {
            setImgProfileSrc(defaultImageProfile);
        }
    }

    const followUser = () => {
        if (token != null) {
            if (btnId === 'btn-in') {
                fetch(`http://localhost:8081/api/users/follow/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setBtnId('btn-out');
                        setBtnMessage('Unfollow');
                    } else {
                        console.log(res.statusText);
                    }
                }).catch((err) => { console.log(err) });
            } else {
                fetch(`http://localhost:8081/api/users/follow/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setBtnId('btn-in');
                        setBtnMessage('Follow');
                    } else {
                        console.log(res.statusText);
                    }
                }).catch((err) => { console.log(err) });
            }
        }
    }

    useEffect(() => {
        getUser();
    }, [userId])

    return (
        <div className='container'>
            <Row>
                <Col md={{ span: 6 }}>
                    <img className='float-right' src={imgProfileSrc} alt="user" width='30%' height='auto' />                </Col>
                <Col md={{ span: 4 }} >
                    <div className="d-flex align-items-center justify-content-between">
                        <div className='float-right'>
                            <h2>{username}</h2>
                            <h3>{firstname + lastname}</h3>
                            <h5>{biography}</h5>
                        </div>
                        <button className='btn' id={btnId} onClick={() => followUser()}>{btnMessage}</button>
                    </div>
                </Col>
            </Row >
            <br />
            <br />
            {userId !== null ? <PublicationsList url={`http://localhost:8081/api/publications/users/${userId}`} /> : undefined}
        </div >
    )
}

export default User
