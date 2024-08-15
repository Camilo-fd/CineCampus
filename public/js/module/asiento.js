document.addEventListener('DOMContentLoaded', function()  {
    const choose__seat = document.getElementById("back-pelicula_detalle")
    choose__seat.addEventListener("click", function(event) {
        event.preventDefault();
        history.back()
    })
})