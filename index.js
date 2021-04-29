const { ApolloServer, gql } = require('apollo-server');

// servidor

//schema
const typeDefs = gql`

type Query {
    obtenerProductos: [Producto]
}

type Producto {
    nombre : String
    descripcion : String
}

`;


const productos = [
    {
        nombre: 'pañales',
        descripcion: 'Para bebe etapa2'
    },
    {
        nombre: 'pasta dental',
        descripcion: 'para gengitivitis',
    },
    {
        nombre: 'otro producto',
        descripcion: 'descripcion otro producto'
    }, 
    {
        nombre: 'otro producto 2',
        descripcion: 'descripcion otro producto 2'
    }
];

//resolver
const resolvers = {
    Query: {
        obtenerProductos: () => productos
    },
};


const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});