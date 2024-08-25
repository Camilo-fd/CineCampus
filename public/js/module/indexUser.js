function mostrarAlerta(mensaje) {
    const alerta = document.getElementById('miAlerta');
    alerta.querySelector('p').textContent = mensaje;
    alerta.classList.remove('oculto');
}

function ocultarAlerta() {
    document.getElementById('miAlerta').classList.add('oculto');
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("button");

    button.addEventListener("click", async () => {
        const nombre = document.getElementById("username").value;
        const contraseña = document.getElementById("password").value;

        // Validar si los campos están vacíos
        if (!nombre.trim() || !contraseña.trim()) {
            mostrarAlerta('Please complete all fields.');
            return; // Salir de la función para que no se ejecute el código siguiente
        }

        // Crear el objeto de datos
        const userData = {
            nombre,
            contraseña
        };

        try {
            // Enviar una solicitud POST al servidor
            const response = await fetch('/usuario/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const result = await response.json();
            // console.log('Respuesta completa:', result);

            // Validar la respuesta
            if (result && result.nombre && result.email) {
                localStorage.setItem('nombre', nombre);
                localStorage.setItem('id', result.id);
                window.location.href = '/pelicula';
            } else {
                mostrarAlerta('Incorrect username or password.');
            }
        } catch (error) {
            console.error('Error sending data:', error);
            mostrarAlerta('Could not enter.');
        }
    });

    // Event listener para ocultar la alerta
    const cerrarAlertaButton = document.getElementById('cerrarAlerta');
    if (cerrarAlertaButton) {
        cerrarAlertaButton.addEventListener('click', ocultarAlerta);
    }
});