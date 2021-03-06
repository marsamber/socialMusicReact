import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import defaultImage from './default.png';
import auth from './auth';


const PublicationsList = (props: any) => {
    const [data, setData] = useState<any[]>([]);
    console.log(props);
    const getPublications = async () => {
        let url = 'http://localhost:8081/api/publications';
        if (props.url) {
            url = props.url;
        }
        let token = localStorage.getItem('token');
        if (token !== null) {
            const resp = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            });
            setData(await resp.json());
        } else {
            const resp = await fetch('http://localhost:8081/api/publications/public', {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setData(await resp.json());
        }
    }

    useEffect(() => {
        getPublications();
    }, [])

    if (data.length > 0) {
        let numRow = data.length / 4;
        numRow = Math.round(numRow) + 1;
        let i = -1;
        return <>
            {[...Array(numRow)].map((el, index) => {
                return <Row className='row-m-t' key={index}>
                    {[...Array(4)].map((el) => {
                        i++;
                        if (i < data.length)
                            return <Publication pub={data[i]} key={data[i].id} />
                    })}
                </Row>
            })}
        </>

    } else if (props.origin === 'search') {
        return <p>No results found</p>
    } else {
        console.log(props)
        return <><h1 className='text-center'>We don't have any posts to show you!</h1></>
    }
}

const Publication = (props: any) => {
    let id = `/${props.pub.id}`;
    const [imgSrc, setImgSrc] = useState('');
    const [username, setUsername] = useState('');
    const [me, setMe] = useState('');

    const loadUser = () => {
        let token = localStorage.getItem('token');
        if (token !== null) {
            fetch(`http://localhost:8081/api/users/${props.pub.userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((user) => {
                        setUsername(user.username);
                    });
                } else {
                    console.log(res.statusText);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const loadImages = () => {
        if (props.pub.image !== null) {
            fetch(`http://localhost:8081/api/images/${props.pub.image.id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (url) => {
                let image = await url.json();
                setImgSrc(`data:${image.image.type};base64,${Buffer.from(image.imageData.data).toString('base64')}`);
            });
        } else if (props.pub.urlImg !== null) {
            setImgSrc(props.pub.urlImg);

        } else {
            setImgSrc(defaultImage);
        }
    }

    useEffect(() => {
        loadImages();
        loadUser();

        let aux = localStorage.getItem('userId');
        if (aux !== null)
            setMe(aux);
    }, []);

    return (<Col id='col-m-tb' xl={3} sm={6} xs={12} >

        <Link to={id}>
            <div className='textIm'>
                <a href={props.pub.userId === parseInt(me) ? '/profile' : `/user/${props.pub.userId}`} onClick={(e) => e.stopPropagation()} style={{
                    color: 'white',
                    textDecoration: 'none'
                }} className=' text-center'>
                    {username} <br />
                    {props.pub.title}
                </a>
            </div>
        </Link>
        <span className='helper'></span><img className='thumb' src={imgSrc} alt={props.pub.image} height='auto' width='100%' />
    </Col >
    )
}

export default PublicationsList
