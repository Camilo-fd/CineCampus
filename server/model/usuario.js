const connect = require("../helpers/connect");

module.exports = class usuario extends connect{
    static instanceUsuario;
    db
    collection

    constructor() {
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("usuarios");
        if (typeof usuario.instanceUsuario === 'object') {
            return usuario.instanceUsuario;
        }
        usuario.instanceUsuario = this;
        return this;
    }

    destructor() {
        connect.instanceConnect = undefined;
        // item.instanceItem = undefined;
    }

    async getAll(){
        await this.conexion.connect();
        const data = await this.collection.find({}).toArray()
        await this.conexion.close();
        return data
    }

    // Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).

    /**
         * This function is responsible for creating a new user in the system.
         * It handles different roles (VIP, standard, admin) and performs various validations.
         * 
         * @param {Object} objecto - The object containing user information.
         * @param {string} objecto.nombre - The user's name.
         * @param {string} objecto.email - The user's email.
         * @param {string} objecto.contraseña - The user's password.
         * @param {string} objecto.rol - The user's role (VIP, estandar, administrador).
         * 
         * @returns {Object} - An object containing either a success message or an error message.
         * @returns {Object.message} - A success message indicating that the user was created correctly.
         * @returns {Object.error} - An error message indicating that an error occurred during the user creation process.
     */
    async newUser(objecto) {
        try {
            await this.conexion.connect();
            const db = this.conexion.db("CineCampus");
    
            // Genero el nuevo id del usuario
            const [dataUsuario] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdUsuario = dataUsuario.id + 1;
    
            // Genero el nuevo numero de la tarjeta VIP
            const dataNumeroVip = await this.collection.find({}).sort({ "tarjeta_VIP.numero": -1 }).limit(1).toArray();
            const numeroVip = dataNumeroVip.length > 0 ? dataNumeroVip[0].tarjeta_VIP.numero + 1 : 1;
    
            // Valido que el nombre no exita
            const nombreExiste = await this.collection.findOne({ nombre: objecto.nombre });
            if (nombreExiste) {
                return { error: "El nombre de usuario ya existe." };
            }
    
            // Valido que el email no exita
            const emailExiste = await this.collection.findOne({ email: objecto.email });
            if (emailExiste) {
                return { error: "El email ya está en uso." };
            }
    
            // Valido que el email sea correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(objecto.email)) {
                throw new Error("El email ingresado no tiene una estructura válida.");
            }
    
            // Creo la fecha expiracion 
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
    
            // Añado el usuario a Mongo
            let mongoUsuario = {
                createUser: objecto.nombre,
                pwd: objecto.contraseña,
                roles: [
                    { role: objecto.rol, db: "CineCampus" }
                ]
            };
    
            // Creo el nuevo usuario VIP
            let nuevoUsuarioVip = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol,
                tarjeta_VIP: {
                    fecha_expiracion: fechaExpiracion,
                    numero: numeroVip,
                    descuento: 10
                }
            };
    
            // Creo el nuevo usuario dependiendo del rol
            let nuevoUsuario = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol
            };
    
            // Inserto el nuevo usuario en la base de datos según el rol
            if (objecto.rol === "vip") {
                await this.collection.insertOne(nuevoUsuarioVip);
            } else {
                await this.collection.insertOne(nuevoUsuario);
            }
            await db.command(mongoUsuario);
    
            return { message: "Usuario creado correctamente" };
    
        } catch (error) {
            return { error: error.toString() };
        } finally {
            await this.conexion.close();
        }
    }

    // Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.

    /**
         * This function retrieves detailed information about a user from the database.
         * It includes the user's role and VIP card status.
         *
         * @param {number} id - The unique identifier of the user.
         *
         * @returns {Promise<Object>} - A promise that resolves to an object containing the user's information.
         * If the user is found, the object will contain the user's details.
         * If the user is not found, the object will contain an error message.
         * If an error occurs during the database operation, the object will contain an error message.
     */
    async getUserById(objecto) {
        try {
            await this.conexion.connect()

            let dataUsuario = await this.collection.findOne({ id: objecto.id });
            if (!dataUsuario) {
                return { error: "Usuario no encontrado" };
            }

            return dataUsuario;

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close()
        }
    }

    // Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).

    /**
        This function updates the role of a user in the database.
        If the new role is "VIP", it also creates a new VIP card for the user.
        @param {Object} objecto - The object containing the user's ID and the new role.
        @param {number} objecto.usuario_id - The unique identifier of the user.
        @param {string} objecto.nuevoRol - The new role for the user. It can be "VIP", "estandar", or "administrador".
        @returns {Promise
        <Object>
        } - A promise that resolves to an object containing either a success message or an error message.
        @returns {Object.message} - A success message indicating that the user's role was updated correctly.
        @returns {Object.error} - An error message indicating that an error occurred during the role update process.
    */
        async updateUserRole(objecto) {
            try {
                await this.conexion.connect();
                const db = this.conexion.db("MongoII");
        
                // Verifico el usuario
                let dataUsuario = await this.collection.findOne({ id: objecto.usuario_id });
                if (!dataUsuario) {
                    return { error: "Usuario no encontrado" };
                }
        
                // Inicializa el objeto de actualización
                const NuevoCampo = { rol: objecto.nuevoRol };
        
                // Verifica si el nuevo rol es "vip"
                if (objecto.nuevoRol === "vip") {
                    // Creo el nuevo número VIP
                    const dataNumeroVip = await this.collection.find({}).sort({ "tarjeta_VIP.numero": -1 }).limit(1).toArray();
                    const numeroVip = dataNumeroVip.length > 0 ? dataNumeroVip[0].tarjeta_VIP.numero + 1 : 1;
        
                    // Creo la fecha de expiración de la tarjeta VIP
                    const fechaExpiracion = new Date();
                    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
        
                    // Nueva tarjeta VIP
                    const tarjeta_VIP = {
                        fecha_expiracion: fechaExpiracion,
                        numero: numeroVip,
                        descuento: 10
                    };
        
                    // Añade el campo tarjeta_VIP a NuevoCampo
                    NuevoCampo.tarjeta_VIP = tarjeta_VIP;
                }
        
                // Elimina el usuario existente
                await db.command({ dropUser: dataUsuario.nombre });
        
                // Crea el usuario con el nuevo rol
                let mongoUsuario = {
                    createUser: dataUsuario.nombre,
                    pwd: dataUsuario.contrasena,
                    roles: [
                        { role: objecto.nuevoRol, db: "MongoII" }
                    ]
                };
        
                // Inserta el nuevo usuario en la base de datos
                await db.command(mongoUsuario);
        
                // Actualiza el documento del usuario en la colección
                await this.collection.updateOne(
                    { id: objecto.usuario_id },
                    { $set: NuevoCampo }
                );
        
                return { message: "Rol actualizado correctamente" };
        
            } catch (error) {
                return { error: error.toString() };
            } finally {
                await this.conexion.close();
            }
        }

    // Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).

    /**
         * Retrieves a list of users from the database based on the specified role.
         * If no role is provided, all users will be returned.
         *
         * @param {string} rol - The role of the users to retrieve. It can be "VIP", "estandar", or "administrador".
         *
         * @returns {Promise<Object[]>} - A promise that resolves to an array of user objects.
         * If no users are found with the specified role, the promise will resolve to an error object with the message "No se encontraron usuarios con el rol especificado".
         * If an error occurs during the database operation, the promise will resolve to an error object with the error message.
     */
    async getUsersByRole(rol) {
        try {
            await this.conexion.connect();

            // Crear el objeto de consulta
            let query = {};
            if (rol) {
                query.rol = rol;  // Se agrega el rol al objeto de consulta
            }

            // Busca usuarios que coincidan con la consulta
            let dataUsuarios = await this.collection.find(query).toArray();
            if (dataUsuarios.length === 0) {
                return { error: "No se encontraron usuarios con el rol especificado" };
            }

            return dataUsuarios

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close();
        }
    }
}