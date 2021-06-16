import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faComments, faShare } from '@fortawesome/free-solid-svg-icons';
import auth from './auth';
import defaultImage from './default.png';

const Publication = () => {

    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    let token = localStorage.getItem('token');

    const [publication, setPublication] = useState<any>()
    const [audioSrc, setAudioSrc] = useState('');
    const [videoSrc, setvideoSrc] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [user, setUser] = useState('');
    const [comments, setComments] = useState(false);

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

    const loadUser = (publication: any) => {
        if (token !== null) {
            fetch(`http://localhost:8081/api/users/${publication.userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then(async (res) => {
                if (res.status === 200) {
                    let resp = await res.json();
                    setUser(resp.username);
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
        console.log(`http://localhost:8081/api/publications/${publicationId}`);
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
                        setPublication(publication);
                        loadImage(publication);
                        loadUser(publication);
                        loadAudio(publication);
                        loadVideo(publication);
                    })
                } else {
                    console.log(res.statusText);
                }
            })
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
                        {publication.singer} - {publication.title}
                    </h1>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col md={{ span: 6 }}>
                    <Row>
                        <Col>
                            <h2>{user}</h2>
                            <p>{publication.description}</p>
                        </Col>


                    </Row>
                    <Row>
                        <Col>{comments ?
                            <div style={{ overflowY: 'scroll', height: '50vh' }}>
                                <h2>
                                    Comments
                            </h2>
                                <div>
                                    <h3>User 1</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue nibh eu molestie maximus. Pellentesque lobortis sem non leo placerat condimentum. Sed pretium nisl et ipsum gravida, sed elementum metus finibus.</p>
                                </div>
                                <div>
                                    <h3>User 2</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue nibh eu molestie maximus. Pellentesque lobortis sem non leo placerat condimentum. Sed pretium nisl et ipsum gravida, sed elementum metus finibus.</p>
                                </div>
                                <div>
                                    <h3>User 3</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue nibh eu molestie maximus. Pellentesque lobortis sem non leo placerat condimentum. Sed pretium nisl et ipsum gravida, sed elementum metus finibus.</p>
                                </div>
                            </div>
                            : undefined}</Col>
                    </Row>
                </Col>
                <Col md={{ span: 4, offset: 1 }}>
                    <Row>
                        {imgSrc === '' || audioSrc === '' ? undefined : <img className='thumb' src={imgSrc} alt='thumbnail' height='auto' width='100%' />}

                    </Row>
                    <Row>
                        {audioSrc === '' ? undefined : <audio controls autoPlay loop src={audioSrc} />}
                        {videoSrc === '' ? undefined : <video controls autoPlay loop src={videoSrc} />}
                        {/* {videoSrc === '' ? undefined : <iframe allowFullScreen src="" />} el src tiene que ser https://www.youtube.com/embed/mm7s6NoRtNg asi, crear check para decidir si es de yt el video y entonces decir como se tiene q hacer */}
                    </Row>
                    <br />
                    <Row>
                        <Col className='text-center' style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <button className='btn btn-pub' id='btn-in' onClick={() => setComments(!comments)}><FontAwesomeIcon icon={faComments}></FontAwesomeIcon></button>
                            <button className='btn btn-pub' id='btn-in'><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                            <button className='btn btn-pub' id='btn-in'><FontAwesomeIcon icon={faShare}></FontAwesomeIcon></button>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </div >
    )
}

export default Publication
