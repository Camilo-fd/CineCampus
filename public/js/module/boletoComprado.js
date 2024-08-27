document.addEventListener('DOMContentLoaded', async function () {
    const backButton = document.getElementById("back-pagos");
    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            history.back();
        });
    }

    const dataTickets = localStorage.getItem('tickets');
    const objectoT = JSON.parse(dataTickets);
    console.log(objectoT);
    
    if (Array.isArray(objectoT)) {
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        
        objectoT.forEach((objecto) => {
            // Formatear el ID para que tenga 5 caracteres numéricos
            let formattedId = (objecto._id.match(/\d+/g) || []).join('');
            formattedId = formattedId.slice(0, 5);
            
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            slide.innerHTML = `
                <div class="ticket__cover">
                    <div class="ticket__cover__img">
                        <img src="${objecto.pelicula.url}" alt="movie-cover">
                    </div>
                    <div class="movie__title__advice">
                        <h3 class="movie__title">${objecto.pelicula.titulo}</h3>
                        <p>show ticket at the entrance</p>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="botton__section">
                    <div class="cinema">
                        <div class="cinema__info">
                            <p>Cinema</p>
                            <h2>CampusLands</h2>
                        </div>
                        <div class="cinema__img">
                            <img src="https://media.licdn.com/dms/image/v2/D4E0BAQHE7i80RsNKcg/company-logo_200_200/company-logo_200_200/0/1681242172220/campuslands_logo?e=2147483647&v=beta&t=fD-jCUuIRu8uYnOn-t6IIQuXyO9tEtwsZ39CkM8zlI0" alt="">
                        </div>
                    </div>
                    <div class="info1">
                        <div class="date">
                            <p>Date</p>
                            <h5>${objecto.proyeccion.fecha.split('T')[0]}</h5>
                        </div>
                        <div class="time">
                            <p>Time</p>
                            <h5>${objecto.proyeccion.hora}</h5>
                        </div>
                    </div>
                    <div class="info2">
                        <div class="cinema__bottom">
                            <p>Cinema hall #</p>
                            <h5>CampusLands</h5>
                        </div>
                        <div class="seat">
                            <p>Seat</p>
                            <h5>${objecto.asientos_filtrados.map(asiento => asiento.numero).join(', ')}</h5>
                        </div>
                    </div>
                    <div class="info3">
                        <div class="cost">
                            <p>Cost</p>
                            <h5>$${objecto.proyeccion.precio_boleto}</h5>
                        </div>
                        <div class="orderID">
                            <p>Order ID</p>
                            <h5>${formattedId}</h5>
                        </div>
                    </div>
                    <div class="divider2"></div>
                    <div class="barCode">
                        <img src="../img/imagebarra.webp" alt="">
                    </div>
                </div>
            `;
            
            carouselWrapper.appendChild(slide);
        });
        
        const prevButton = document.querySelector('.prev-button');
        const nextButton = document.querySelector('.next-button');
        const wrapper = document.querySelector('.carousel-wrapper');
        let index = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        
        function showSlide(n) {
            if (n >= slides.length) {
                index = 0;
            } else if (n < 0) {
                index = slides.length - 1;
            } else {
                index = n;
            }
            wrapper.style.transform = `translateX(-${index * 100}%)`;
        }
        
        prevButton.addEventListener('click', () => {
            showSlide(index - 1);
        });
        
        nextButton.addEventListener('click', () => {
            showSlide(index + 1);
        });
        
        // Auto-slide every 5 seconds
        setInterval(() => {
            showSlide(index + 1);
        }, 2000);
    } else {
        console.log("No se encontró un arreglo de boletos en localStorage.");
    }
});
