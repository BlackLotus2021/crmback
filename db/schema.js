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
type Token{
    token:String
}
input AutenticarUsuarioInput{
    email:String!
    password:String!
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
    obtenerUsuario(token:String!) : Usuario
}

type Mutation{
    nuevoUsuario(input:UsuarioInput): Usuario
    autenticarUsuario(input:AutenticarUsuarioInput): Token
}

`;

module.exports = typeDefs;