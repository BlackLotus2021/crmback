const { ApolloServer, gql } = require('apollo-server');



//schema
const typeDefs = gql`

type Query {
    obtenerProductos: [Producto]
    obtenerCategoria: [Categoria]
}

type Producto {
    nombre : String
    descripcion : String
}

type Categoria{
    categoria:String
}


`;


const productos = [
    {
        nombre: 'COMPLEJO B TAB C30',
        categoria: 'Básicos'
    },
    {
        nombre: 'Limustin 1mg Cap C50',
        categoria: 'Alta especialidad',
    },
    {
        nombre: 'KABRITA ETAPA 2 FORMULA 400G',
        categoria: 'Bebes'
    }, 
    {
        nombre: 'PRUDENCE ANILLO VIBRADOR TERREMO',
        categoria: 'Salud sexual'
    }
];

//resolver
const resolvers = {
    Query: {
        obtenerProductos: () => productos,
        obtenerCategoria: () => productos
    },
};


const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});