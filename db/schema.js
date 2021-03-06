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
    nombre:String
    existencia:Int
    precio:Float
    categoria:String
    creado:String
}
type Cliente{
    id:ID
    nombre:String
    apellido:String
    email:String
    telefono:String
    vendedor:ID
}
type Pedido{
    id:ID
    pedido:[PedidoGrupo]
    total:Float
    cliente:ID
    vendedor:ID
    fecha:String
    estado:EstadoPedido
}
type PedidoGrupo{
    id:ID
    cantidad: Int
    nombre:String
    precio:Float
}
type TopCliente {
    total: Float
    cliente: [Cliente]
    
}
type TopVendedor {
    total: Float
    vendedor: [Usuario]
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
input ClienteInput{
    nombre:String!,
    apellido:String!,
    email:String!,
    telefono:String
}
input PedidoInput{
    pedido:[PedidoProductoInput]
    total:Float
    cliente:ID
    estado:EstadoPedido
}
input PedidoProductoInput{
    id:ID
    cantidad:Int
    nombre:String,
    precio:Float
}

enum EstadoPedido{
    PENDIENTE
    COMPLETADO
    CANCELADO
}

type Query{
    #Usuarios
    obtenerUsuario(token:String!) : Usuario
    #Productos
    obtenerProductos:[Producto]
    obtenerProducto(id:ID!) : Producto
    #Clientes
    obtenerClientes:[Cliente]
    obtenerClientesVendedor:[Cliente]
    obtenerCliente(id:ID!):Cliente
    #Pedidos
    obtenerPedidos:[Pedido]
    obtenerPedidosVendedor:[Pedido]
    obtenerPedido(id:ID!):Pedido
    obtenerPedidosEstado(estado:String!):[Pedido]
     
    # Busquedas Avanzadas
    mejoresClientes: [TopCliente]
    mejoresVendedores: [TopVendedor]
    buscarProducto(texto: String!) : [Producto]
}


type Mutation{
    #Usuarios
    nuevoUsuario(input:UsuarioInput): Usuario
    autenticarUsuario(input:AutenticarUsuarioInput): Token

    #Productos
    nuevoProducto(input:ProductoIntput):Producto
    actualizarProducto(id:ID!, input:ProductoIntput):Producto
    eliminarProducto(id:ID!): String

    #Clientes
    nuevoCliente(input:ClienteInput): Cliente
    actualizarCliente(id:ID, input:ClienteInput): Cliente
    eliminarCliente(id:ID!):String

    #Pedidos
    nuevoPedido(input:PedidoInput):Pedido
    actualizarPedido(id:ID!, input:PedidoInput):Pedido
    eliminarPedido(id:ID!):String
}

`;

module.exports = typeDefs;