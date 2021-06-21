import React, { useEffect, useState } from 'react'
import { Col, Row, InputGroup, FormControl, Modal, Button, Form, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faComments, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import auth from './auth';
import defaultImage from './default.png';
import Error from './Error';
import PublicationsList from './PublicationsList';

const Publication = () => {

    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    let token = localStorage.getItem('token');

    const [publication, setPublication] = useState<any>();
    const [votes, setVotes] = useState<number>(0);
    const [audioSrc, setAudioSrc] = useState('');
    const [videoSrc, setvideoSrc] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [owner, setOwner] = useState('');
    const [me, setMe] = useState('');
    const [amIOwner, setAmIOwner] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [profile, setProfile] = useState('/profile');
    const [tags, setTags] = useState<string>('');
    const [newTags, setNewTags] = useState<string>('');
    const [oldData, setOldData] = useState<any>();
    const [newComment, setNewComment] = useState('');
    const [btnId, setBtnId] = useState('btn-in');

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const loadImage = (publication: any) => {
        if (publication.image !== null) {
            fetch(`http://localhost:8081/api/images/${publication.image.id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (url) => {
                let image = await url.json();
                console.log(image)
                setImgSrc(`data:${image.image.type};base64,${Buffer.from(image.imageData.data).toString('base64')}`);
            });
        } else if (publication.urlImg !== null) {
            setImgSrc(publication.urlImg);

        } else {
            setImgSrc(defaultImage);
        }
    }

    const loadOwner = (publication: any) => {
        if (token !== null) {
            fetch(`http://localhost:8081/api/users/${publication.userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then(async (res) => {
                if (res.status === 200) {
                    let resp = await res.json();
                    setOwner(resp.username);
                }
            })
        }
    }

    const loadAudio = (publication: any) => {
        if (token !== null) {
            if (publication.audio !== null) {
                fetch(`http://localhost:8081/api/audios/${publication.audio.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }).then(async (url) => {
                    let audio = await url.json();
                    console.log(audio)
                    setAudioSrc(`data:${audio.audio.type};base64,${Buffer.from(audio.audioData.data).toString('base64')}`);
                });
            } else if (publication.urlAudio !== null) {
                setAudioSrc(publication.urlAudio);
            }
        }
    }

    const loadVideo = (publication: any) => {
        if (token !== null) {
            console.log("HJKÑJLK")
            if (publication.video !== null) {
                fetch(`http://localhost:8081/api/videos/${publication.video.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }).then(async (url) => {
                    let video = await url.json();
                    console.log(video)
                    setvideoSrc(`data:${video.video.type};base64,${Buffer.from(video.videoData.data).toString('base64')}`);
                });
            } else if (publication.urlVideo !== null) {
                setvideoSrc(publication.urlVideo);
            }
        }
    }


    const getPublication = () => {
        let publicationId = window.location.pathname.substring(1);
        let token = localStorage.getItem('token');
        if (token !== null) {
            fetch(`http://localhost:8081/api/publications/${publicationId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then(async (res) => {
                if (res.status === 200) {
                    res.json().then((publication) => {
                        setOldData({ title: publication.title, singer: publication.singer, description: publication.description });
                        setVotes(publication.votes.length);
                        setPublication(publication);
                        let userId = localStorage.getItem('userId');
                        if (userId !== null) {
                            setMe(userId);
                            if (publication.userId === parseInt(userId)) {
                                setAmIOwner(true);
                                setProfile('/profile');
                            } else {
                                setProfile(`/user/${publication.userId}`);
                            }

                            for (let i = 0; i < publication.votes.length; i++) {
                                if (publication.votes[i].userId === parseInt(userId)) {
                                    setBtnId('btn-out');
                                }
                            }
                        }
                        if (publication.tags.length > 0) {
                            let listTags = ''
                            for (let i = 0; i < publication.tags.length; i++) {
                                const tag = publication.tags[i].name;
                                listTags = listTags + ' ' + tag;
                                if (i !== publication.tags.length - 1) {
                                    listTags = listTags + ',';
                                }
                            }
                            setTags(listTags);
                            setNewTags(listTags);

                        }

                        loadImage(publication);
                        loadOwner(publication);
                        loadAudio(publication);
                        loadVideo(publication);
                    })
                } else {
                    console.log(res.statusText);
                    window.location.href = "/error";
                }
            })
        }
    }


    const validateForm = () => {
        if (token !== null) {
            let publicationUpdated = {
                title: publication.title,
                singer: publication.singer,
                description: publication.description,
                public: publication.public
            }

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('x-access-token', token);

            const arr = tags.split(",").map((item: string) => item.trim());
            const newArr = newTags.split(',').map((item: string) => item.trim());
            for (let i = 0; i < arr.length; i++) {
                const tag = arr[i];
                if (newArr.includes(tag))
                    newArr.splice(newArr.indexOf(tag), 1);
                else {
                    fetch(`http://localhost:8081/api/tags?name=${tag}`, {
                        method: 'GET',
                        headers: myHeaders
                    }).then((res) => {
                        if (res.status === 200) {
                            res.json().then((tag) => {
                                let tagId = tag[0].id;
                                fetch(`http://localhost:8081/api/publications/${publication.id}/tags/${tagId}`, {
                                    method: 'DELETE',
                                    headers: myHeaders
                                }).then((res) => {
                                    if (res.status !== 200) {
                                        console.log(res.statusText);
                                    }
                                })
                            })
                        } else {
                            console.log(res.statusText);
                        }
                    })
                }

            }
            for (let i = 0; i < newArr.length; i++) {
                const tag = newArr[i];
                fetch(`http://localhost:8081/api/tags?name=${tag}`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        res.json().then((tagResp) => {
                            if (tagResp.length > 0) {
                                let tagId = tagResp[0].id;
                                fetch(`http://localhost:8081/api/publications/${publication.id}/tags/${tagId}`, {
                                    method: 'POST',
                                    headers: myHeaders
                                }).then((res) => {
                                    if (res.status !== 200) {
                                        console.log(res.statusText);
                                    }
                                })
                            } else {
                                let newTag = { name: tag };
                                fetch(`http://localhost:8081/api/tags`, {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: JSON.stringify(newTag)
                                }).then((res) => {
                                    if (res.status === 200) {
                                        res.json().then((tag) => {
                                            let tagId = tag.id;
                                            fetch(`http://localhost:8081/api/publications/${publication.id}/tags/${tagId}`, {
                                                method: 'POST',
                                                headers: myHeaders
                                            }).then((res) => {
                                                if (res.status !== 200) {
                                                    console.log(res.statusText);
                                                }
                                            })
                                        })
                                    } else {
                                        console.log(res.statusText);
                                    }
                                })
                            }
                        })
                    }
                })
            }
            fetch(`http://localhost:8081/api/publications/${publication.id}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(publicationUpdated)
            }).then((res) => {
                if (res.status === 200) {
                    window.location.href = `/${publication.id}`;
                } else {
                    console.log(res.statusText);
                }
            })

        }
    }



    const deletePublication = () => {
        if (token !== null) {
            fetch(`http://localhost:8081/api/publications/${publication.id}`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': token
                }
            });
            window.location.href = '/profile';
        }

    }

    const createComment = () => {
        if (token !== null) {
            let comment = {
                comment: newComment
            }
            fetch(`http://localhost:8081/api/publications/${publication.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify(comment)
            }).then((res) => {
                if (res.status === 200) {
                    window.location.href = `/${publication.id}`;
                } else {
                    console.log(res.statusText);
                }
            }).catch((err) => { console.log(err) });
        }

    }

    const votePublication = () => {
        let me = localStorage.getItem('userId');
        if (token !== null && me !== null) {
            if (btnId === 'btn-in') {
                fetch(`http://localhost:8081/api/publications/${publication.id}/votes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setVotes(votes + 1);
                        setBtnId('btn-out');
                    } else {
                        console.log(res.statusText);
                    }
                }).catch((err) => console.log(err));
            } else {
                fetch(`http://localhost:8081/api/publications/${publication.id}/votes`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setVotes(votes - 1);
                        setBtnId('btn-in');
                    } else {
                        console.log(res.statusText);
                    }
                }).catch((err) => console.log(err));
            }
        }
    }


    useEffect(() => {
        getPublication();
    }, []);

    if (!publication) return <div>Loading...</div>

    return (
        <div className='container'>
            <Row >
                <Col className='text-center'>
                    <h1>
                        {oldData.singer} - {oldData.title}
                    </h1>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col md={{ span: 4 }}>
                    <Row>
                        {imgSrc === '' || audioSrc === '' ? undefined : <img className='thumb' src={imgSrc} alt='thumbnail' height='auto' width='100%' />}

                    </Row>
                    <Row>
                        {audioSrc === '' ? undefined : <audio controls autoPlay loop src={audioSrc} />}
                        {videoSrc === '' ? (audioSrc === '' ? <img className='thumb' src={imgSrc} alt='thumbnail' height='auto' width='100%' /> : undefined) : <video controls autoPlay loop src={videoSrc} />}
                        {/* {videoSrc === '' ? undefined : <iframe allowFullScreen src="" />} el src tiene que ser https://www.youtube.com/embed/mm7s6NoRtNg asi, crear check para decidir si es de yt el video y entonces decir como se tiene q hacer */}
                    </Row>
                    <br />
                    <Row>
                        <Col className='text-center' style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <button className='btn btn-pub' id={btnId} onClick={() => votePublication()}><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> {votes}</button>
                            {amIOwner ? <button className='btn btn-pub' id='btn-in' onClick={handleShowEdit}><FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon></button>
                                : undefined}
                            <Modal show={showEdit} onHide={handleCloseEdit} size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit</Modal.Title>
                                </Modal.Header>
                                <Form
                                // onSubmit={() => validateForm()}
                                >
                                    <Modal.Body>
                                        <Row className='align-items-center'>
                                            <Col md={{ span: 7 }}>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
                                                    <FormControl
                                                        value={publication.title}
                                                        aria-label="Username"
                                                        aria-describedby="basic-addon1" onChange={(e) => setPublication({ ...publication, title: e.target.value })}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text id="basic-addon2">Singer</InputGroup.Text>
                                                    <FormControl
                                                        value={publication.singer}
                                                        aria-label="Singer"
                                                        aria-describedby="basic-addon2"
                                                        onChange={(e) => setPublication({ ...publication, singer: e.target.value })}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text>Description</InputGroup.Text>
                                                    <FormControl as="textarea" aria-label="With textarea" value={publication.description}
                                                        onChange={(e) => setPublication({ ...publication, description: e.target.value })} />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text>Tags</InputGroup.Text>
                                                    <FormControl as="textarea" aria-label="With textarea" value={newTags.toString()} onChange={(e) => setNewTags(e.target.value)} />
                                                </InputGroup>
                                                {publication.public ? <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="I want a public publication"
                                                    checked
                                                    onChange={() => setPublication({ ...publication, public: false })}
                                                /> : <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    label="I want a public publication"
                                                    onChange={() => setPublication({ ...publication, public: true })}
                                                />}

                                            </Col>
                                            <Col>
                                                {imgSrc === '' ? undefined : <img className='thumb mb-3' src={imgSrc} alt='thumbnail' height='auto' width='100%' />}

                                            </Col>
                                        </Row>

                                    </Modal.Body>
                                    <Modal.Footer className='justify-content-center'>
                                        <Button id='btn-in'
                                            // type="submit"
                                            type='button'
                                            onClick={() => validateForm()}
                                        >
                                            Accept
                                        </Button>
                                        <Button id='btn-out' type='button' onClick={() => deletePublication()}>Delete publication</Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        </Col>
                    </Row>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Row>
                        <Col>
                            <a href={profile} style={{ textDecoration: 'none', color: 'black' }}><h2>{owner}</h2></a>
                            <p>{oldData.description}</p>
                        </Col>
                        <Col>
                            {tags.length > 0 ? <><span style={{ fontSize: 'large' }}>Tags: </span>{tags.split(",").map((item: string) => { return <>&nbsp;<a key={item.trim()} href={`/search?tag=${item.trim()}`} style={{ color: '#0a6151' }}>{item.trim()}</a> &nbsp;</> })}</> : undefined}
                        </Col>
                    </Row>
                    <Row>
                        <Col><h2>
                            Comments
                        </h2>
                            {publication.comments.length === 0 ? undefined :
                                <div style={{ overflowY: 'scroll', height: '40vh' }}>
                                    {publication.comments.map((item: any, index: any) => <Comment key={index} comment={item} publicationId={publication.id}></Comment>)}
                                </div>
                            }
                            <br />
                            <InputGroup>
                                <FormControl as="textarea" aria-label="With textarea" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                <button className='btn' id='btn-in' onClick={() => createComment()}>Send comment</button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>


        </div >
    )
}

const Comment = (props: any) => {

    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [show, setShow] = useState(true);
    const [showEditComment, setShowEditComment] = useState(false);
    const [comment, setComment] = useState(props.comment.comment);
    const [commentEdited, setCommentEdited] = useState(props.comment.comment);

    let token = localStorage.getItem('token');
    let aux = localStorage.getItem('userId');
    let me;
    if (aux !== null) me = parseInt(aux);

    const editComment = () => {
        if (token !== null) {
            let newComment = {
                comment
            }
            fetch(`http://localhost:8081/api/publications/comments/${props.comment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify(newComment)
            }).then((res) => {
                if (res.status === 200) {
                    setCommentEdited(comment);
                    setShowEditComment(false);
                }
                else {
                    console.log(res.statusText);
                }
            }).catch((err) => { console.log(err) });
        }

    }

    const deleteComment = () => {
        if (token !== null) {
            fetch(`http://localhost:8081/api/publications/comments/${props.comment.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => {
                if (res.status === 200) {
                    setShow(false);
                } else {
                    console.log(res.statusText);
                }
            }).catch((err) => { console.log(err) });
        }
    }

    const loadUser = () => {
        if (token !== null) {
            fetch(`http://localhost:8081/api/users/${props.comment.userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((user) => {
                        setUsername(user.username);
                        setUserId(user.id);
                    });
                } else {
                    console.log(res.statusText);
                }
            }).catch((err) => { console.log(err) });
        }

    }

    useEffect(() => {
        loadUser();
    }, [])

    if (!show) {
        return <></>;
    }
    return (<div>
        <a href={`/user/${userId}`} style={{ textDecoration: 'none', color: 'black' }}><h3>{username}</h3></a>
        <div className="d-flex justify-content-between">
            <p>{commentEdited}</p>
            {props.comment.userId === me ? <ButtonGroup size="sm" className='pb-3'>
                <Button type='button' className='btn' id='btn-out-icon' onClick={() => setShowEditComment(true)}><FontAwesomeIcon icon={faPencilAlt} /></Button><Button type='button' className='btn' id='btn-out-icon' onClick={() => deleteComment()} > <FontAwesomeIcon icon={faTrash} /></Button>
            </ButtonGroup> : undefined}
        </div>

        <Modal show={showEditComment} onHide={() => setShowEditComment(false)} size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit comment</Modal.Title>
            </Modal.Header>
            <Form
            // onSubmit={() => validateForm()}
            >
                <Modal.Body>
                    <Row className='align-items-center'>
                        <Col>
                            <InputGroup className="mb-3">
                                <FormControl as="textarea" aria-label="With textarea" value={comment} onChange={(e) => setComment(e.target.value)} />
                            </InputGroup>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer className='justify-content-center'>
                    <Button id='btn-in'
                        // type="submit"
                        type='button'
                        onClick={() => editComment()}
                    >
                        Accept
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </div>)


}

export default Publication
