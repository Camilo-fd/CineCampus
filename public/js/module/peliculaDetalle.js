document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        try {
            const response = await fetch(`http://localhost:5000/pelicula/id/${id}`);
            if (!response.ok) throw new Error('Error al cargar la película');
            const movie = await response.json();
            
            const video_main = document.getElementById("video-main");
            video_main.innerHTML = "";

            const iframe = document.createElement("iframe");
            iframe.src = `${movie[0].video}`;
            iframe.width = "400";
            iframe.height = "450";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            video_main.appendChild(iframe);

        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('No movie ID provided.');
    }
});
