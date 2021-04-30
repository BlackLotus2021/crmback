const Usuario = require('../models/Usuario')
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