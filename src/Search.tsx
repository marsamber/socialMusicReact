import { AnyARecord } from 'node:dns';
import React, { useEffect, useState } from 'react'
import auth from './auth';
import PublicationsList from './PublicationsList'
import defaultImageProfile from './defaultProfile.png';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Search = () => {
    if (!auth.isLogged()) {
        window.location.href = '/';
    }

    const [tag, setTag] = useState<any>();
    const [key, setKey] = useState('');

    let token = localStorage.getItem('token');

    const loadPage = () => {
        if (token !== null) {
            if (window.location.search.includes('tag')) {
                let tag = window.location.search.substring(5);
                if (tag !== '') {
                    fetch(`http://localhost:8081/api/tags?name=${tag}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        }
                    }).then((res) => {
                        if (res.status === 200) {
                            res.json().then((tags) => {
                                let tag = tags[0];
                                setTag(tag);
                            });
                        } else {
                            console.log(res.statusText);
                        }
                    }).catch((err) => { console.log(err) });
                }
            } else if (window.location.search.includes('key')) {
                let key = window.location.search.substring(5);
                setKey(key);
                if (key !== '') {
                    fetch(`http://localhost:8081/api/tags/includes?name=${key}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        }
                    }).then((res) => {
                        if (res.status === 200) {
                            res.json().then((tags) => {
                                let tag = tags[0];
                                setTag(tag);
                            });
                        } else {
                            console.log(res.statusText);
                        }
                    }).catch((err) => { console.log(err) });
                }

            }

        }
    }

    useEffect(() => {
        loadPage();
    }, [])

    return (
        <div className='container'>
            {key !== '' ? <><h1>Search: {key}</h1><h2>Users</h2><Users query={key}></Users>
                <h2>Publications by title</h2><PublicationsList origin='search' url={`http://localhost:8081/api/publications?title=${key}`}></PublicationsList>
                <h2>Publications by singer</h2><PublicationsList origin='search' url={`http://localhost:8081/api/publications?singer=${key}`}></PublicationsList> </> : undefined}
            {tag !== undefined ? key !== '' ? <><h2>Publications with tags including: {key}</h2><PublicationsList url={`http://localhost:8081/api/publications/tags/${tag.id}`} /></> : <><h2>Publications with tag: {tag.name}</h2><PublicationsList url={`http://localhost:8081/api/publications/tags/${tag.id}`} /></> : undefined}
            {key === '' && tag === undefined ? <h2>Try searching something!</h2> : undefined}
        </div>
    )
}

const Users = (props: any) => {
    let token = localStorage.getItem('token');
    const [users, setUsers] = useState<any[]>()
    const loadUsers = () => {
        if (token !== null) {
            fetch('http://localhost:8081/api/users', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((users) => {
                        console.log(users);
                        let listUsers: any[] = [];
                        for (let i = 0; i < users.length; i++) {
                            if (users[i].username.toLowerCase().includes(props.query.toLowerCase()) || users[i].firstname.toLowerCase().includes(props.query.toLowerCase())) {
                                listUsers.push(users[i]);
                            } else if (users[i].lastname !== null && users[i].lastname.toLowerCase().includes(props.query.toLowerCase())) {
                                listUsers.push(users[i]);
                            }
                        }
                        setUsers(listUsers);
                    })
                } else {
                    console.log(res.statusText);
                }
            }).catch((err) => console.log(err));
        }
    }
    useEffect(() => {
        loadUsers();
    }, [])

    if (users !== undefined && users.length > 0) {
        let numRow = users.length / 4;
        numRow = Math.round(numRow) + 1;
        let i = -1;
        return <>
            {[...Array(numRow)].map((el, index) => {
                return <Row className='row-m-t' key={index}>
                    {[...Array(4)].map((el) => {
                        i++;
                        if (i < users.length)
                            return <User user={users[i]} key={users[i].id} />
                    })}
                </Row>
            })}
        </>
    }
    else {
        return <p>No results found</p>
    }

}

const User = (props: any) => {

    const [imgSrc, setImgSrc] = useState('')

    const loadImages = () => {
        if (props.user.image !== null) {
            fetch(`http://localhost:8081/api/images/${props.user.image.id}`, {
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
            setImgSrc(defaultImageProfile);
        }
    }

    useEffect(() => {
        loadImages();
    }, [])

    return (<Col id='col-m-tb' xl={3} sm={6} xs={12} >

        <Link to={`/user/${props.user.id}`}>
            <div className='textIm'>
                <p style={{
                    color: 'white',
                    textDecoration: 'none'
                }} className=' text-center'>
                    {props.user.username}
                </p>
            </div>
        </Link>
        <span className='helper'></span><img className='thumb' src={imgSrc} alt={props.user.image} height='auto' width='100%' />
    </Col >
    )
}

export default Search