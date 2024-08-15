document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        try {
            const response = await fetch(`/pelicula/id/${id}`);
            if (!response.ok) throw new Error('Error al cargar la película');
            const movie = await response.json();

            const video_main = document.getElementById("video-main");
            video_main.innerHTML = "";

            const imagen = document.createElement("div")
            imagen.classList.add("imagen_video-main")
            imagen.innerHTML = `
                <img src="${movie[0].url}" alt="" class="">
            `
            video_main.append(imagen)
            
            // --------------------------------------------

            const info_video_main = document.querySelector(".info_video-main div")
            info_video_main.innerHTML = ""

            const h5 = document.createElement("h5")
            h5.textContent = movie[0].titulo

            const p = document.createElement("p")
            p.textContent = movie[0].genero
            info_video_main.append(h5)
            info_video_main.append(p)

            // --------------------------------------------

            const sipnosis_p = document.querySelector("#p")
            sipnosis_p.textContent = movie[0].sinopsis

            // --------------------------------------------

            const actor_list = document.querySelector("#actor-list")
            actor_list.innerHTML = ""

            movie[0].actores.forEach((actor) => {
                const actor_info = document.createElement("div")
                actor_info.classList.add("actor-info")
                actor_info.innerHTML = `
                    <img src="${actor.imagen}" alt="Antonio Banderas">
                    <div>
                        <p class="actor-name">${actor.nombre}</p>
                        <p class="actor-rol">${actor.personaje}</p>
                    </div>
                `
                actor_list.append(actor_info)
            })

            // --------------------------------------------

            const button_video_main = document.getElementById("button_video-main");
            let estado = false;

            button_video_main.addEventListener('click', () => {
                if (estado) {
                    video_main.innerHTML = "";

                    const iframe = document.createElement("iframe");
                    iframe.src = `${movie[0].video}`;
                    iframe.width = "400";
                    iframe.height = "450";
                    iframe.frameBorder = "0";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;

                    button_video_main.innerHTML = `
                        <i class="bi bi-play-fill"></i> 
                        See Cover
                    `
                    video_main.appendChild(iframe);

                } else {
                    video_main.innerHTML = "";

                    const imagen = document.createElement("div")
                    imagen.classList.add("imagen_video-main")
                    imagen.innerHTML = `
                        <img src="${movie[0].url}" alt="" class="">
                    `
                    button_video_main.innerHTML = `
                        <i class="bi bi-play-fill"></i> 
                        Watch Trailer
                    `
                    video_main.append(imagen)
                }
                estado = !estado;
            });

            // --------------------------------------------

            const choose__seat = document.getElementById("back-pelicula")
            choose__seat.addEventListener("click", function(event) {
                event.preventDefault();
                history.back()
            })

            // --------------------------------------------

            const button_footer = document.getElementById("button-footer")
            button_footer.addEventListener('click', () => {
                window.location.href = `/views/asiento.html`;
            });

        } catch (error) {
            console.error(error);
        }
    } else {
        console.error('No movie ID provided.');
    }
});
