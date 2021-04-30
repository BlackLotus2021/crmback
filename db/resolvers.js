const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {
    // console.log(usuario);
    const { id, email, nombre, apellido } = usuario;
    return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn })
}

//resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }) => {
            const usuarioId = await jwt.verify(token,process.env.SECRETA);
            return usuarioId
        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input }) => {
            const { email, password } = input;

            //Revisar si el usuario ya existe
            const existeUsuario = await Usuario.findOne({ email });
            if (existeUsuario) {
                throw new Error('El usuario ya existe');
            }

            //Hashear pw
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt)

            //Guardar en BD
            try {
                const usuario = new Usuario(input);
                usuario.save();// guardarlo
                return usuario;
            } catch (error) {
                console.log(error)
            }
        },
        autenticarUsuario: async (_, { input }) => {
            const { email, password } = input;

            //Usurio existe
            const existeUsuario = await Usuario.findOne({ email });
            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }

            //revisar si el pw es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password)
            if (!passwordCorrecto) {
                throw new Error('El password no es correcto');
            }

            //Crear el toquen
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        }
    }
};

module.exports = resolvers;