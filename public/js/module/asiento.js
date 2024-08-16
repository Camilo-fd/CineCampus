document.addEventListener('DOMContentLoaded', function()  {
    const choose__seat = document.getElementById("back-pelicula_detalle")
    choose__seat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back()
    })
})

const front = document.querySelectorAll(".front__seat");
front.forEach(seat => {
    seat.addEventListener("click", () => {
        // Verifica el color de fondo actual y cambia el color
        if (seat.style.backgroundColor === 'red') {
            seat.style.backgroundColor = '#cecece'; // Color inicial
            seat.style.color = 'black'; // Color de texto inicial
        } else {
            seat.style.backgroundColor = 'red'; // Color cuando se hace clic
            seat.style.color = '#cecece'; // Color de texto cuando se hace clic
        }
    });
});

const back = document.querySelectorAll(".back__seat");
back.forEach(seat => {
    seat.addEventListener("click", () => {
        // Verifica el color de fondo actual y cambia el color
        if (seat.style.backgroundColor === 'red') {
            seat.style.backgroundColor = '#cecece'; // Color inicial
            seat.style.color = 'black'; // Color de texto inicial
        } else {
            seat.style.backgroundColor = 'red'; // Color cuando se hace clic
            seat.style.color = '#cecece'; // Color de texto cuando se hace clic
        }
    });
});

const day = document.querySelectorAll(".day");
day.forEach(days => {
    days.addEventListener("click", () => {
        // Verifica el color de fondo actual y cambia el color
        if (days.style.backgroundColor === 'red') {
            days.style.backgroundColor = '#F8F5F5'; // Color inicial
            days.style.color = 'black'; // Color de texto inicial
        } else {
            days.style.backgroundColor = 'red'; // Color cuando se hace clic
            days.style.color = '#F8F5F5'; // Color de texto cuando se hace clic
        }

        const paragraphs = days.querySelectorAll(".day p");
        paragraphs.forEach(p => {
            if (days.style.backgroundColor === 'red') {
                p.style.backgroundColor = 'red'; 
                p.style.color = "white"
            } else {
                p.style.backgroundColor = 'white';
                p.style.color = "black"
            }
        });
    });
});

const times = document.querySelectorAll(".time");

times.forEach(time => {
    time.addEventListener("click", () => {
        if (time.style.backgroundColor === 'red') {
            time.style.backgroundColor = '#F8F5F5'; 
            time.style.color = 'black';
        } else {
            time.style.backgroundColor = 'red';
            time.style.color = '#F8F5F5'; 
        }

        const paragraphs = time.querySelectorAll(".time p");
        paragraphs.forEach(p => {
            if (time.style.backgroundColor === 'red') {
                p.style.backgroundColor = 'red'; 
                p.style.color = "white"
            } else {
                p.style.backgroundColor = 'white';
                p.style.color = "black"
            }
        });
    });
});