import { connect } from "../../helpers/db/connect.js";

export class usuario extends connect{
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
            await this.conexion.connect()

            // Genero el nuevo id del usuario
            const [dataUsuario] = await this.collection.find({}).sort({ id: -1 }).limit(1).toArray();
            const newIdUsuario = dataUsuario.id + 1;

            // Genero el nuevo numero de la tarjeta VIP
            const dataNumeroVip = await this.collection.find({}).sort({ tarjeta_VIP: -1 }).limit(1).toArray();
            const numeroVip = dataNumeroVip[0].tarjeta_VIP.numero + 1

            // Valido que el nombre no exita
            const nombreExiste = await this.collection.findOne({ nombre: objecto.nombre });
            if (nombreExiste) {
                return { error: "El nombre de usuario ya existe." }
            }

            // Valido que el email no exita
            const emailExiste = await this.collection.findOne({ email: objecto.email });
            if (emailExiste) {
                return { error: "El email ya está en uso." }
            }

            // Valido que el email sea correcto
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(objecto.email)) {
                throw new Error("El email ingresado no tiene una estructura válida.");
            }

            // Creo la fecha expiracion 
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

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
            }

            // Creo el nuevo usuario estandar
            let nuevoUsuarioEstandar = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol,
            }

            // Creo el nuevo usuario administrador
            let nuevoUsuarioAdministrador = {
                id: newIdUsuario,
                nombre: objecto.nombre,
                email: objecto.email,
                contrasena: objecto.contraseña,
                rol: objecto.rol,
            }

            // Inserto el nuevo usuario en la base de datos según el rol
            if (objecto.rol === "vip") {
                await this.collection.insertOne(nuevoUsuarioVip)
            } else if (objecto.rol === "estandar") {
                await this.collection.insertOne(nuevoUsuarioEstandar)
            } else if (objecto.rol === "administrador") {
                await this.collection.insertOne(nuevoUsuarioAdministrador)
            } 

            return { message: "Usuario creado correctamente"}

        } catch (error) {
            return { error: error.toString() }
        } finally {
            await this.conexion.close()
        }
    }
}