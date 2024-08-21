export async function convertToFileObjectURL(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => URL.createObjectURL(blob))
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}