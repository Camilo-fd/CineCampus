document.addEventListener('DOMContentLoaded', async() => {
    const button = document.getElementById("button");
    
    button.addEventListener("click", async() => {
        const nombre = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const rol = document.getElementById("rol").value;
        const contraseña = document.getElementById("password").value;

       // Crear el objeto de datos
       const userData = {
        nombre,
        email,
        rol,
        contraseña
        };

        try {
            // Enviar una solicitud POST al servidor
            const response = await fetch('/usuario/newUser', {
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

            window.location.href = '/pelicula';
            console.log("Usuario creado");
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    });
});