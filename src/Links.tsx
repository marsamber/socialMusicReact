import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { Button, Form, FormControl, Modal, Nav, Navbar, Alert } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
// import Login from './Login';
import auth from './auth';
import bsCustomFileInput from 'bs-custom-file-input';
// import { Link } from 'react-router-dom'

const Links = () => {
    const [showLogin, setShowLogin] = useState(false);

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    const [showRegister, setShowRegister] = useState(false);

    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameReg, setUsernameReg] = useState<string | null>(null);
    const [emailReg, setEmailReg] = useState<string | null>(null);
    const [firstnameReg, setFirstnameReg] = useState<string | null>(null);
    const [lastnameReg, setLastnameReg] = useState<string | null>(null);
    const [phoneReg, setPhoneReg] = useState<number | null>(null);
    const [passwordReg, setPasswordReg] = useState<string | null>(null);
    const [check, setCheck] = useState(false);
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [imgUpl, setImgUpl] = useState<any>();

    const [showErrorsLogin, setShowErrorsLogin] = useState(false);
    const [errorsLogin, setErrorsLogin] = useState<string | null>(null);

    const [showErrorsReg, setShowErrorsReg] = useState(false);
    const [errorsReg, setErrorsReg] = useState<string | null>(null);

    const [key, setKey] = useState('');

    let token = localStorage.getItem('token');

    const validateForm = () => {
        let login_data = {
            username,
            password
        }

        fetch('http://localhost:8081/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login_data)
        }).then(async (res) => {
            let resp = await res.json();
            if (res.status === 200) {
                auth.saveToken(resp);
                window.location.href = '/';
            }
            else {
                setShowErrorsLogin(true);
                setErrorsLogin(resp.message);
            }
        });

    }
    const validateForm2 = async () => {
        let reg_data = {
            username: usernameReg,
            email: emailReg,
            firstname: firstnameReg,
            lastname: lastnameReg,
            phone: phoneReg,
            password: passwordReg,
            public: !check,
            urlImg: imgUrl
        }

        if (usernameReg === null || emailReg === null || firstnameReg === null || passwordReg === null) {
            setShowErrorsReg(true);
            setErrorsReg('You must fill all the fields marked as required!');
        }
        else {
            if (imgUpl !== undefined) {
                const formdata = new FormData();
                formdata.append("file", imgUpl);
                fetch('http://localhost:8081/api/images', {
                    method: 'POST',
                    body: formdata
                }).then((res) => {
                    if (res.status === 200) {
                        res.json().then((image) => {
                            let imageId = image.id;
                            fetch(`http://localhost:8081/api/auth/signup/${imageId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(reg_data)
                            }).then(async (res) => {
                                if (res.status === 200) {
                                    window.location.href = '/';
                                }
                                else {
                                    let resp = await res.json();
                                    setShowErrorsReg(true);
                                    console.log(res);
                                    setErrorsReg(resp.message);
                                }
                            }).catch((err) => console.log(err));
                        })
                    } else {
                        console.log(res.statusText);
                    }
                })
            } else {
                fetch('http://localhost:8081/api/auth/signup/0', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reg_data)
                }).then(async (res) => {
                    if (res.status === 200) {
                        window.location.href = '/';
                    }
                    else {
                        let resp = await res.json();
                        setShowErrorsReg(true);
                        console.log(res);
                        setErrorsReg(resp.message);
                    }
                }).catch((err) => console.log(err));
            }

        }

    }

    const loginSpotify = () => {
        window.location.href = 'http://localhost:8081/api/spotify/login';
        // fetch('http://localhost:8081/api/spotify/login', {
        //     mode: 'no-cors'
        // }).then((res) => console.log(res));
    }

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files !== null) {
            setImgUpl(e.target.files[0]);
        }

    }

    const search = () => {
        if (token !== null) {
            if (key === '')
                window.location.href = '/search';
            else {
                window.location.href = `/search?key=${key}`;
            }
        }
    }

    useEffect(() => {
        bsCustomFileInput.init();
    }, [])

    if (auth.isLogged())
        return (
            <Navbar expand='lg' variant='dark'>
                <Navbar.Brand href='/'>
                    Social Music
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className={` ${window.location.pathname === '/' ? 'active' : null}`} href='/'>
                            Home
                        </Nav.Link>
                        <Nav.Link className={`${window.location.pathname === '/profile' ? 'active' : null}`} href="/profile">
                            Profile
                        </Nav.Link>
                        <Nav.Link className={`${window.location.pathname === '/followed' ? 'active' : null}`} href="/followed">
                            Followed
                        </Nav.Link>
                        <Nav.Link className={` ${window.location.pathname === '/messages' ? 'active' : null}`} href="/messages">
                            Messages
                        </Nav.Link>
                        <Nav.Link className={`${window.location.pathname === '/explore' ? 'active' : null}`} href="/explore">
                            Explore
                        </Nav.Link>
                        <Nav.Link className={`${window.location.pathname === '/upload' ? 'active' : null}`} href="/upload">
                            <FontAwesomeIcon icon={faUpload} /> Upload
                        </Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className='mr-sm-2' onChange={(e) => setKey(e.target.value)} />
                        <Button id='btn-out' onClick={() => search()}>Search</Button>
                    </Form>
                    <Button id='btn-in' onClick={() => auth.logout()}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </Button>
                </Navbar.Collapse>
            </Navbar>
        )
    else {

        return (<Navbar expand='lg' variant='dark'>
            <Navbar.Brand href='/'>
                Social Music
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className={` ${window.location.pathname === '/' ? 'active' : null}`} href='/'>
                        Home
                    </Nav.Link>
                </Nav>
                <Button id='btn-in' onClick={handleShowLogin}>
                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                </Button>
                <Modal show={showLogin} onHide={handleCloseLogin} className='modalLogin'>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Form
                    // onSubmit={() => validateForm()}
                    >
                        <Modal.Body>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>

                            {showErrorsLogin ? <Alert variant='danger'>
                                {errorsLogin}
                            </Alert> : undefined}

                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                            <Button id='btn-out'
                                // type="submit"
                                type='button' onClick={() => validateForm()}
                            >
                                Sign in
                            </Button>
                            <Button id='btn-in' onClick={handleShowRegister}>
                                Create Account
                            </Button>
                            <a onClick={() => loginSpotify()} className="btn btn-success"> <FontAwesomeIcon icon={faSpotify} /> Log in with Spotify</a>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal show={showRegister} onHide={handleCloseRegister}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create account</Modal.Title>
                    </Modal.Header>
                    <Form
                    // onSubmit={() => validateForm2()}
                    >
                        <Modal.Body>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username *</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsernameReg(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email *</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmailReg(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicFirstname">
                                <Form.Label>Firstname *</Form.Label>
                                <Form.Control type="text" placeholder="Enter firstname" onChange={(e) => setFirstnameReg(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicLastName">
                                <Form.Label>Lastname</Form.Label>
                                <Form.Control type="text" placeholder="Enter lastname" onChange={(e) => setLastnameReg(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="phone" placeholder="Enter phone" onChange={(e) => setPhoneReg(parseInt(e.target.value))} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password *</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPasswordReg(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="formBasicImgUrl">
                                <Form.Control type='text' placeholder='URL profile image' onChange={(e) => setImgUrl(e.target.value)} />
                            </Form.Group>
                            <p className="text-center">or</p>
                            <Form.Group controlId="formBasicImg">
                                <Form.File custom label='Upload profile image' onChange={uploadFile} />
                            </Form.Group>

                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="I want a private profile" onChange={(e) => setCheck(e.target.checked)} />
                            </Form.Group>

                            <Form.Text id="passwordHelpBlock" muted>
                                * You must fill out all required fields before checking
                            </Form.Text>

                            {showErrorsReg ? <Alert variant='danger'>
                                {errorsReg}
                            </Alert> : undefined}

                        </Modal.Body>
                        <Modal.Footer className='justify-content-center'>
                            <Button id='btn-in'
                                // type="submit"
                                type='button' onClick={() => validateForm2()}
                            >
                                Register
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Navbar.Collapse>
        </Navbar>)
    }
}

export default Links
