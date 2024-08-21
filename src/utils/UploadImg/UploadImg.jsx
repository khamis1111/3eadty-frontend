import React, { useEffect, useState } from 'react';
import { convertToFileObjectURL } from '../convertToFileObjectURL';
import './UploadImg.css';
const UploadImg = ({ setImgSelector, setVideoSrc, type, videoSrc, imgSelector }) => {
    const [convertImgSelector, setConvertImgSelector] = useState(null);
    const [convertVideoSrc, setConvertVideoSrc] = useState(null);

    // Convert img and Video To ObjectURLFile
    useEffect(() => {
        const convertData = async () => {
            // if (videoSrc !== null) {
            //     const videoURL = await convertToFileObjectURL(videoSrc);
            //     setConvertVideoSrc(videoURL);
            // }
            if (imgSelector !== null) {
                const imgURL = await convertToFileObjectURL(imgSelector);
                setConvertImgSelector(imgURL);
            }
        };
        convertData();
    }, [imgSelector])

    const [icon, setIcon] = useState(null);
    const [video, setVideo] = useState(null);

    const handleImg = (e) => {
        if (e.target.files && e.target.files[0]) {
            setIcon(URL.createObjectURL(e.target.files[0]));
            setImgSelector(e.target.files[0]);
        }
    };
    const handleVideo = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(URL.createObjectURL(e.target.files[0]));
            setVideoSrc(e.target.files[0]);
        }
    };

    // IF Id deleted delete video and Img
    const dataId = localStorage.getItem('dataId')
    useEffect(() => {
        if (!dataId) {
            setConvertImgSelector(null);
            setConvertVideoSrc(null);
            setIcon(null);
            setVideo(null);
        }
    }, [dataId])

    return (
        type === 'img' ?
            <label htmlFor="img" className="custum-file-upload">
                {
                    icon || convertImgSelector ? <img src={icon || convertImgSelector} alt="" className='selectedImg' /> :
                        (
                            <>
                                <div className="icon">
                                    <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                                </div>
                                <div className="text">
                                    <span>Click to upload image</span>
                                </div>
                            </>
                        )
                }

                <input id="img" type="file" onChange={(e) => handleImg(e)} />
            </label>
            :
            <label htmlFor="video" className="custum-file-upload">
                {
                    video || convertVideoSrc ? <video className='selectedImg' src={video || convertVideoSrc} autoPlay muted /> :
                        (
                            <>
                                <div className="icon">
                                    <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
                                </div>
                                <div className="text">
                                    <span>Click to upload Video</span>
                                </div>
                            </>
                        )
                }
                <input id="video" type="file" onChange={(e) => handleVideo(e)} />
            </label>
    )

}

export default UploadImg
