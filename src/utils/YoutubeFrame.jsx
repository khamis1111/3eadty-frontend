import React from 'react'
import { getEmbedUrl, getIdEmbedUrl } from './GetEmbedUrl'

const YoutubeFrame = ({ youtubeUrl }) => {
    return (
        <div
            style={{
                position: "relative",
                paddingBottom: "56.15%",
                height: 0,
                // overflow: "hidden"
            }}
        >
            <iframe
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0
                }}
                loading="lazy"
                srcDoc={`
                            <style>
                                * {
                                    padding: 0;
                                    margin: 0;
                                    overflow: hidden;
                                }
                                body, html {
                                    height: 100%;
                                }
                                img, svg {
                                    position: absolute;
                                    width: 100%;
                                    height: 100%;
                                    top: 0;
                                    bottom: 0;
                                    margin: auto;
                                    object-fit: cover;
                                }
                                svg {
                                    filter: drop-shadow(1px 1px 10px hsl(206.5, 70.7%, 8%));
                                    transition: all 250ms ease-in-out;
                                    width: 100%;
                                    height: 50px;
                                }
                                body:hover svg {
                                    filter: drop-shadow(1px 1px 10px hsl(206.5, 0%, 10%));
                                transform: scale(1.2);
                                }
                            </style>

                    <a href=${`${getEmbedUrl(youtubeUrl)}?autoplay=1&mute=1&amp;controls=1`}>
                        <img src=${`https://img.youtube.com/vi/${getIdEmbedUrl(youtubeUrl)}/hqdefault.jpg`} alt='Yaya-Yamani'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none'         stroke='#ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play-circle'><circle cx='12' cy='12' r='10'></circle><polygon points='10 8 16 12 10 16 10 8'></polygon> 
                            </svg>
                    </a>
                    `}
                src={`${getEmbedUrl(youtubeUrl)}`}
                title="Yaya-Yamani"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    )
}

export default YoutubeFrame
