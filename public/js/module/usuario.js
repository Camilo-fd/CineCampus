document.addEventListener('DOMContentLoaded', async() => {
    const button = document.getElementById("button");
    
    button.addEventListener("click", async() => {
        const nombre = document.getElementById("username").value;
        const contraseña = document.getElementById("password").value;

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
            console.log('Resultado:', result);
            localStorage.setItem('nombre', nombre)

            window.location.href = '/pelicula';
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    });
})