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
type Producto{
    id:ID
    nombre:String!
    existencia:Int!
    precio:Float!
    categoria:String!
    creado:String!
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

input ProductoIntput{
    nombre:String!
    existencia:Int!
    precio:Float!
    categoria:String!
}

type Query{
    #Usuarios
    obtenerUsuario(token:String!) : Usuario
    #Productos
    obtenerProductos:[Producto]
    obtenerProducto(id:ID!) : Producto
}


type Mutation{
    #Usuarios
    nuevoUsuario(input:UsuarioInput): Usuario
    autenticarUsuario(input:AutenticarUsuarioInput): Token

    #Productos
    nuevoProducto(input:ProductoIntput):Producto
    actualizarProducto(id:ID!, input:ProductoIntput):Producto
    eliminarProducto(id:ID!): String
}

`;

module.exports = typeDefs;