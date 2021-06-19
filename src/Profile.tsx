import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faCheck, faTimes, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
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
    const [showEdit, setShowEdit] = useState(false);
    const [user, setUser] = useState<any>();

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
                        setUser(resp);
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

    const validateForm = () => {
        if (token !== null) {
            let newUser = {
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                biography: user.biography
            }
            const myHeaders = new Headers();
            myHeaders.append("x-access-token", token);
            myHeaders.append("Content-Type", "application/json");
            fetch("http://localhost:8081/api/users", {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(newUser)
            }).then((res) => {
                if (res.status === 200) {
                    window.location.href = '/profile';
                } else {
                    console.log(res.statusText);
                }
            }).catch((err) => {
                console.log(err);
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
                    <Col className='text-center'><h4 >Edit Profile <button className='btn' onClick={() => setShowEdit(true)}><FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon></button></h4></Col>
                </Row>
                <Row>
                    <Col className='text-center'><h4>Delete Account <button className='btn' onClick={() => deleteAccount()}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button></h4></Col>
                </Row>

                <Modal show={showEdit} onHide={() => setShowEdit(false)} size="sm"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit profile</Modal.Title>
                    </Modal.Header>
                    <Form
                    // onSubmit={() => validateForm()}
                    >
                        <Modal.Body>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Firstname</InputGroup.Text>
                                <FormControl
                                    value={user.firstname}
                                    aria-label="Firstname"
                                    aria-describedby="basic-addon1"
                                    onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Lastname</InputGroup.Text>
                                <FormControl
                                    value={user.lastname}
                                    aria-label="lastname"
                                    aria-describedby="basic-addon1"
                                    onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">Phone</InputGroup.Text>
                                <FormControl
                                    value={user.phone}
                                    aria-label="phone"
                                    aria-describedby="basic-addon1"
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Biography</InputGroup.Text>
                                <FormControl as="textarea" aria-label="With textarea" value={user.biography} onChange={(e) => setUser({ ...user, biography: e.target.value })} />
                            </InputGroup>

                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                            <Button id='btn-in'
                                // type="submit"
                                type='button'
                                onClick={() => validateForm()}
                            >
                                Accept
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div > : undefined
            }


        </div >
    )
}

export default Profile
