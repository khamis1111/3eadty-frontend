import React from 'react'
import { SlSocialFacebook } from 'react-icons/sl'
import { FaInstagram } from "react-icons/fa";
import { LuYoutube } from "react-icons/lu";
import { SlSocialBehance } from "react-icons/sl";
import './SocailIcons.css'

const SocailIcons = ({ allData }) => {

    return (
        <div className="main-bg1 rounded-5 shadow icons gap-3">
            {allData.data && allData.data.length > 0 && allData.data[0].socailMedia && (
                <>
                    <a href={allData.data[0].socailMedia.linkFacebook} className="svg" target="_blank" rel="noreferrer">
                        <SlSocialFacebook />
                    </a>
                    <a href={allData.data[0].socailMedia.linkInstargram} className="svg" target="_blank" rel="noreferrer">
                        <FaInstagram />
                    </a>
                    <a href={allData.data[0].socailMedia.linkBehance} className="svg" target="_blank" rel="noreferrer">
                        <SlSocialBehance />
                    </a>
                    <a href={allData.data[0].socailMedia.linkYoutube} className="svg" target="_blank" rel="noreferrer">
                        <LuYoutube />
                    </a>
                </>
            )}
        </div >
    )
}

export default SocailIcons
