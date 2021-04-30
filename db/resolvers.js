//resolver
const resolvers = {
    Query: {
        obtenerProducto: () => "s"
    },
    Mutation: {
        nuevoUsuario: (_,{input}) => {
            console.log(input);
            return "creando"
        }
    }
};

module.exports = resolvers;