// Video Loader Module
document.addEventListener('DOMContentLoaded', function() {
    const videoElement = document.getElementById('mainVideo');
    const loadingMessage = document.getElementById('loadingMessage');
    const baseUrls = {
        videy: "https://cdn.videy.co/",
        quax: "https://qu.ax/"
    };

    function loadVideo() {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedVideoId = urlParams.get('videoID');
        const apiUrl = requestedVideoId 
            ? `/api/videos?videoID=${requestedVideoId}` 
            : `/api/videos?random=true`;

        fetch(apiUrl)
            .then(handleResponse)
            .then(handleVideoData)
            .catch(handleError);
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    function handleVideoData(data) {
        if (!data.videos || data.videos.length === 0) {
            throw new Error('Video not found or list is empty');
        }

        const selectedVideo = data.videos[0];
        if (!selectedVideo?.id) {
            throw new Error('Video data is incomplete');
        }

        const source = selectedVideo.source || 'videy';
        const videoUrl = (baseUrls[source] || baseUrls.videy) + selectedVideo.id + ".mp4";

        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        videoElement.load();
        loadingMessage.style.display = 'none';
    }

    function handleError(error) {
        loadingMessage.textContent = `Error: ${error.message}`;
        console.error('Video loading failed:', error);
    }

    loadVideo();
});