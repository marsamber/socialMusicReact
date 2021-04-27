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
    const [showComments, setShowComments] = useState(false);


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
                    console.log("hola" + res);
                    if (res.json.length != 0)
                        res.json().then((publication) => {
                            setPublication(publication);
                            loadImage(publication);
                            loadUser(publication);
                            loadAudio(publication);
                            loadVideo(publication);
                        })
                    else
                        window.location.href = '/errorPage';
                } else {
                    console.log("holadsds" + res);
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
                <Col md={{ span: 3 }}>
                    <Row>
                        {imgSrc === '' || audioSrc === '' ? undefined : <img className='thumb' src={imgSrc} alt='thumbnail' height='auto' width='100%' />}

                    </Row>
                    <Row>
                        {audioSrc === '' ? undefined : <audio controls loop src={audioSrc} />}
                        {videoSrc === '' ? undefined : <video controls loop src={videoSrc} />}
                        {/* {videoSrc === '' ? undefined : <iframe allowFullScreen src="" />} el src tiene que ser https://www.youtube.com/embed/mm7s6NoRtNg asi, crear check para decidir si es de yt el video y entonces decir como se tiene q hacer */}
                    </Row>
                    <br />
                    <Row>
                        <Col className='text-center'>
                            <button className='btn btn-pub' id='btn-in' onClick={() => setShowComments(!showComments)}><FontAwesomeIcon icon={faComments}></FontAwesomeIcon></button>
                            <button className='btn btn-pub' id='btn-in'><FontAwesomeIcon icon={faHeart}></FontAwesomeIcon></button>
                            <button className='btn btn-pub' id='btn-in'><FontAwesomeIcon icon={faShare}></FontAwesomeIcon></button>
                        </Col>
                    </Row>
                </Col>
                <Col md={{ span: 8, offset: 1 }}>
                    <Row>
                        <Col>
                            <h2>{user}</h2>
                            <p>{publication.description}</p>
                        </Col>
                    </Row>
                    <br />
                    {!showComments ? undefined :
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <h3>Comments</h3>
                                    </Col>
                                </Row>
                                <Row className='overflow-auto comments-zone'>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <h5>User 1</h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className='justify'>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae facilisis enim, quis lobortis neque. Maecenas vitae gravida lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur ligula eget feugiat consequat. Proin hendrerit pellentesque scelerisque. Curabitur sed vulputate erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <h5>User 2</h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className='justify'>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae facilisis enim, quis lobortis neque. Maecenas vitae gravida lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur ligula eget feugiat consequat. Proin hendrerit pellentesque scelerisque. Curabitur sed vulputate erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <h5>User 3</h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className='justify'>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae facilisis enim, quis lobortis neque. Maecenas vitae gravida lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur ligula eget feugiat consequat. Proin hendrerit pellentesque scelerisque. Curabitur sed vulputate erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <h5>User 4</h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className='justify'>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae facilisis enim, quis lobortis neque. Maecenas vitae gravida lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur ligula eget feugiat consequat. Proin hendrerit pellentesque scelerisque. Curabitur sed vulputate erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </Col>

                        </Row>
                    }


                </Col>

            </Row>

        </div >
    )
}

export default Publication
