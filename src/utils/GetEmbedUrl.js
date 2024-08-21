export const getEmbedUrl = (url) => {
    if (url && url.startsWith('https://www.youtube.com/shorts')) {
        const videoId = url.split('shorts/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
    } else {    
        const videoId = url && url.split("v=")[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }

};

export const getIdEmbedUrl = (url) => {
    if (url && url.startsWith('https://www.youtube.com/shorts')) {
        const videoId = url.split('shorts/')[1];
        return videoId;
    } else {
        const videoId = url && url.split("v=")[1];
        return videoId;
    }
};