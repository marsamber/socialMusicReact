import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import defaultImage from './default.png';
import auth from './auth';


const PublicationsList = () => {
    const [data, setData] = useState<any[]>([]);

    const getPublications = async () => {
        let token = localStorage.getItem('token');
        if (token !== null) {
            const resp = await fetch('http://localhost:8081/api/publications', {
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
        console.log(data)
        let numRow = data.length / 4;
        numRow = Math.round(numRow) + 1;
        let i = -1;
        return <>
            {[...Array(numRow)].map((el) => {
                return <Row className='row-m-t'>
                    {[...Array(4)].map((el) => {
                        i++;
                        if (i < data.length)
                            return <Publication pub={data[i]} key={data[i].id} />
                    })}
                </Row>
            })}
        </>

    } else {
        return <></>
    }
}

const Publication = (props: any) => {
    console.log(props)
    let id = `/${props.pub.id}`;
    const [imgSrc, setImgSrc] = useState('');

    const loadImages = () => {
        if (props.pub.image !== null) {
            fetch(`http://localhost:8081/api/images/${props.pub.image.id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (url) => {
                let image = await url.json();
                console.log(image)
                setImgSrc(`data:${image.image.type};base64,${Buffer.from(image.imageData.data).toString('base64')}`);
            });
        } else {
            setImgSrc(defaultImage);
        }
    }

    useEffect(() => {
        loadImages();
    }, []);

    return (<Col id='col-m-tb' xl={3} sm={6} xs={12} >
        <Link to={id}>
            <div className='textIm'>
                {props.pub.userId} <br />
                    Photo {props.pub.id}
            </div>
            <span className='helper'></span><img className='thumb' src={imgSrc} alt={props.pub.image} height='auto' width='100%' />
        </Link>
    </Col>
    )
}

export default PublicationsList
