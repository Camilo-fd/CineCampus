function mostrarAlerta(mensaje) {
    const alerta = document.getElementById('miAlerta');
    alerta.querySelector('p').textContent = mensaje; // Actualiza el mensaje de alerta
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
            mostrarAlerta('Por favor, completa todos los campos.');
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
            console.log('Respuesta completa:', result); // Imprime la respuesta completa

            // Validar la respuesta
            if (result && result.nombre && result.email) { // Verifica que los campos esperados estén presentes
                localStorage.setItem('nombre', nombre);
                window.location.href = '/pelicula'; // Redirigir solo si la respuesta es válida
            } else {
                mostrarAlerta('Nombre de usuario o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            mostrarAlerta('Ocurrió un error al procesar la solicitud.');
        }
    });

    // Event listener para ocultar la alerta
    const cerrarAlertaButton = document.getElementById('cerrarAlerta');
    if (cerrarAlertaButton) {
        cerrarAlertaButton.addEventListener('click', ocultarAlerta);
    }
});