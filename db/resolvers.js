const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
//resolver
const resolvers = {
    Query: {
        obtenerProducto: () => "s"
    },
    Mutation: {
        nuevoUsuario: async (_, { input }) => {
            const { email, password } = input;

            //Revisar si el usuario ya existe
            const existeUsuario = await Usuario.findOne({email});
            if(existeUsuario){
                throw new Error('El usuario ya existe');
            }

            //Hashear pw
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password,salt)

            //Guardar en BD
            try {
                const usuario= new Usuario(input);
                usuario.save();// guardarlo
                return usuario;
            } catch (error) {
                console.log(error)
            }
        }
    }
};

module.exports = resolvers;