import React, { useEffect, useState } from 'react'
import { Alert, Col, Form, Row } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import auth from './auth';
import { listenerCount } from 'node:cluster';


// NO FUNCIONA
const Upload = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    const [post, setPost] = useState<any>({
        title: null,
        singer: null,
        description: null,
        urlFile: null,
        urlImg: null,
        file: null,
        image: null,
        isAudio: true
    });

    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState('');
    const token = localStorage.getItem('token');

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files !== null) {
            setPost({ ...post, file: e.target.files[0] })
        }
    }
    const uploadCover = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files !== null) {
            setPost({ ...post, image: e.target.files[0] })
        }
    }

    const upload = () => {
        if (token !== null) {
            let newPost = {
                title: post.title,
                singer: post.singer,
                description: post.description,
                urlImg: null,
                urlAudio: null,
                urlVideo: null
            }
            if (post.isAudio) {
                if (post.file !== null) {
                    fetch('http://localhost:8081/api/audios', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        },
                        body: JSON.stringify(post.file)
                    }).then((res) => {
                        res.json().then((audio) => {
                            const audioId = audio.id;
                            if (post.image !== null) {
                                fetch('http://localhost:8081/api/images', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(post.image)
                                }).then((res) => {
                                    res.json().then((image) => {
                                        const imageId = image.id;
                                        fetch(`http://localhost:8081/api/publications/${imageId}/${audioId}/0`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'x-access-token': token
                                            },
                                            body: JSON.stringify(newPost)
                                        }).then((res) => {
                                            if (res.status === 200) {
                                                window.location.href = '/profile';
                                            } else {
                                                console.log(res.statusText);
                                            }
                                        });
                                    });
                                });
                            } else if (post.urlImg != null) {
                                newPost = { ...newPost, urlImg: post.urlImg };
                                fetch(`http://localhost:8081/api/publications/0/${audioId}/0`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(newPost)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        window.location.href = '/profile';
                                    } else {
                                        console.log(res.statusText);
                                    }
                                });
                            } else {
                                fetch(`http://localhost:8081/api/publications/0/${audioId}/0`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(newPost)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        window.location.href = '/profile';
                                    } else {
                                        console.log(res.statusText);
                                    }
                                });
                            }
                        });
                    });
                } else if (post.urlFile !== null) {
                    if (post.image !== null) {
                        fetch('http://localhost:8081/api/images', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            },
                            body: JSON.stringify(post.image)
                        }).then((res) => {
                            res.json().then((image) => {
                                newPost = { ...newPost, urlAudio: post.urlFile };
                                const imageId = image.id;
                                fetch(`http://localhost:8081/api/publications/${imageId}/0/0`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(newPost)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        window.location.href = '/profile';
                                    } else {
                                        console.log(res.statusText);
                                    }
                                });
                            });
                        });
                    } else if (post.urlImg != null) {
                        newPost = { ...newPost, urlImg: post.urlImg };
                        fetch(`http://localhost:8081/api/publications/0/0/0`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            },
                            body: JSON.stringify(newPost)
                        }).then((res) => {
                            if (res.status === 200) {
                                window.location.href = '/profile';
                            } else {
                                console.log(res.statusText);
                            }
                        });
                    } else {
                        fetch(`http://localhost:8081/api/publications/0/0/0`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            },
                            body: JSON.stringify(newPost)
                        }).then((res) => {
                            if (res.status === 200) {
                                window.location.href = '/profile';
                            } else {
                                console.log(res.statusText);
                            }
                        });
                    }
                } else {
                    setShowErrors(true);
                    setErrors('You must select a file or give an URL for your file!');
                }

            }
            if (!post.isAudio) {
                if (post.file !== null) {
                    fetch('http://localhost:8081/api/videos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        },
                        body: JSON.stringify(post.file)
                    }).then((res) => {
                        res.json().then((video) => {
                            const videoId = video.id;
                            if (post.image !== null) {
                                fetch('http://localhost:8081/api/images', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(post.image)
                                }).then((res) => {
                                    res.json().then((image) => {
                                        const imageId = image.id;
                                        fetch(`http://localhost:8081/api/publications/${imageId}/${videoId}/0`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'x-access-token': token
                                            },
                                            body: JSON.stringify(newPost)
                                        }).then((res) => {
                                            if (res.status === 200) {
                                                window.location.href = '/profile';
                                            } else {
                                                console.log(res.statusText);
                                            }
                                        });
                                    });
                                });
                            } else if (post.urlImg != null) {
                                newPost = { ...newPost, urlImg: post.urlImg };
                                fetch(`http://localhost:8081/api/publications/0/${videoId}/0`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(newPost)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        window.location.href = '/profile';
                                    } else {
                                        console.log(res.statusText);
                                    }
                                });
                            } else {
                                fetch(`http://localhost:8081/api/publications/0/${videoId}/0`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(newPost)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        window.location.href = '/profile';
                                    } else {
                                        console.log(res.statusText);
                                    }
                                });
                            }
                        });
                    });
                } else if (post.urlFile !== null) {
                    if (post.image !== null) {
                        fetch('http://localhost:8081/api/images', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            },
                            body: JSON.stringify(post.image)
                        }).then((res) => {
                            res.json().then((image) => {
                                newPost = { ...newPost, urlVideo: post.urlFile };
                                const imageId = image.id;
                                fetch(`http://localhost:8081/api/publications/${imageId}/0/0`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-access-token': token
                                    },
                                    body: JSON.stringify(newPost)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        window.location.href = '/profile';
                                    } else {
                                        console.log(res.statusText);
                                    }
                                });
                            });
                        });
                    } else if (post.urlImg != null) {
                        newPost = { ...newPost, urlImg: post.urlImg };
                        fetch(`http://localhost:8081/api/publications/0/0/0`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            },
                            body: JSON.stringify(newPost)
                        }).then((res) => {
                            if (res.status === 200) {
                                window.location.href = '/profile';
                            } else {
                                console.log(res.statusText);
                            }
                        });
                    } else {
                        fetch(`http://localhost:8081/api/publications/0/0/0`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            },
                            body: JSON.stringify(newPost)
                        }).then((res) => {
                            if (res.status === 200) {
                                window.location.href = '/profile';
                            } else {
                                console.log(res.statusText);
                            }
                        });
                    }
                } else {
                    setShowErrors(true);
                    setErrors('You must select a file or give an URL for your file!');
                }

            }
        }
    }

    useEffect(() => {
        bsCustomFileInput.init();
    }, [])

    return (
        <div className='container'>
            <Row >
                <Col className='text-center'>
                    <h1>
                        Upload
                    </h1>
                </Col>
            </Row>
            <hr />
            {showErrors ? <Alert variant='danger'>{errors}</Alert> : undefined}
            <Form>
                <Row className='add-space'>
                    <Col md={{ span: 6 }}>
                        <Row className='add-space'>
                            <Col>
                                <Form.Control type="text" placeholder='Title' onChange={(e) => setPost({ ...post, title: e.target.value })} />
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder='Singer' onChange={(e) => setPost({ ...post, singer: e.target.value })} />
                            </Col>
                        </Row>
                        <Row className='add-space'>
                            <Col>
                                <Form.Control as='textarea' placeholder='Description' rows={7} onChange={(e) => setPost({ ...post, description: e.target.value })} />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={{ span: 6 }}>
                        <Row className='add-space'>
                            <Col>
                                <Form.Control type='text' placeholder='URL file' onChange={(e) => setPost({ ...post, urlFile: e.target.value })} />
                            </Col>
                        </Row>
                        <Row className='add-space'>
                            <Col>
                                <Form.Control type='text' placeholder='URL cover' onChange={(e) => setPost({ ...post, urlImg: e.target.value })} />
                            </Col>
                        </Row>
                        <Row className='add-space'>
                            <Col className="text-center"><p>or</p></Col>
                        </Row>
                        <Row className='add-space'>
                            <Col>
                                <Form.File custom label='Upload file' onChange={uploadFile} />
                            </Col>
                        </Row>
                        <Row className='add-space'>
                            <Col>
                                <Form.File custom label='Upload cover' onChange={uploadCover} />
                            </Col>
                        </Row>


                    </Col>
                </Row>
                <Row className='add-space'>
                    <Col className='text-center'>
                        <Form.Group >
                            <Form.Check
                                type="radio"
                                label="Audio"
                                name="audioOrVideo"
                                checked inline
                                onChange={(e) => setPost({ ...post, isAudio: e.target.checked })}
                            />
                            <Form.Check
                                type="radio"
                                label="Video"
                                name="audioOrVideo"
                                inline
                            />

                        </Form.Group>
                    </Col>
                </Row>
                <Row className='add-space'>
                    <Col className='text-center'>
                        <button className='btn' id='btn-in' type='button' onClick={() => upload()} >Confirm</button>
                        <button className='btn' id='btn-out'>Cancel</button>
                    </Col>
                </Row>
            </Form>

        </div>
    )
}

export default Upload
