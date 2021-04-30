const { gql } = require('apollo-server');
//schema
const typeDefs = gql`

type Usuario{
    id:ID
    nombre:String
    apellido:String
    direccion:String
    ciudad:String
    pais:String
    telefono:String
    email:String
    creado:String
}

input UsuarioInput {
    nombre:String!
    apellido:String!
    direccion:String!
    ciudad:String!
    pais:String!
    telefono:String!
    email:String!
    password:String!

}

type Query{
    obtenerProducto: String
}

type Mutation{
    nuevoUsuario(input:UsuarioInput): Usuario
}

`;

module.exports = typeDefs;