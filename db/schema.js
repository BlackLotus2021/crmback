const { gql } = require('apollo-server');
//schema
const typeDefs = gql`

type Query {
    obtenerProductos: [Producto]
    obtenerCategoria: [Categoria]
    obtenerCategoriaInput(input:ProductoInput!) :[Producto]
}

type Producto {
    nombre : String
    categoria : String
}

type Categoria{
    categoria:String
}

input ProductoInput{
    categoria:String
}

`;

module.exports= typeDefs;