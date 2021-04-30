const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {
    // console.log(usuario);
    const { id, email, nombre, apellido } = usuario;
    return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn })
}

//resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }) => {
            const usuarioId = await jwt.verify(token, process.env.SECRETA);
            return usuarioId
        },
        obtenerProductos: async (_, { id }) => {
            try {
                const productos = await Producto.find({})
                return productos
            } catch (error) {
                console.log(error)
            }
        },
        obtenerProducto: async (_, { id }) => {
            //revisar si el producto existe
            const producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            return producto
        },
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find({});
                return clientes
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor: async (_, { }, ctx) => {
            try {
                const clientes = await Cliente.find({ vendedor: ctx.usuario.id.toString() });
                return clientes
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente: async (_, { id }, ctx) => {
            // REvisar si el cliente existe
            const cliente = await Cliente.findById(id);
            if (!Cliente) {
                throw new Error('Cliente no encontrado');
            }

            //Quien lo crea lo puede ver
            if(cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las validaciones');
            }

            return cliente;
        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input }) => {
            const { email, password } = input;

            //Revisar si el usuario ya existe
            const existeUsuario = await Usuario.findOne({ email });
            if (existeUsuario) {
                throw new Error('El usuario ya existe');
            }

            //Hashear pw
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt)

            //Guardar en BD
            try {
                const usuario = new Usuario(input);
                usuario.save();// guardarlo
                return usuario;
            } catch (error) {
                console.log(error)
            }
        },
        autenticarUsuario: async (_, { input }) => {
            const { email, password } = input;

            //Usurio existe
            const existeUsuario = await Usuario.findOne({ email });
            if (!existeUsuario) {
                throw new Error('El usuario no existe');
            }

            //revisar si el pw es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password)
            if (!passwordCorrecto) {
                throw new Error('El password no es correcto');
            }

            //Crear el toquen
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        },
        nuevoProducto: async (_, { input }) => {

            try {
                const producto = new Producto(input);

                //almacenar en bd
                const resultado = await producto.save();

                return resultado;

            } catch (error) {
                console.log(error);
            }
        },
        actualizarProducto: async (_, { id, input }) => {
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            //Guardar en base de datos
            producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });
            return producto

        },
        eliminarProducto: async (_, { id }) => {
            let producto = await Producto.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            //Eliminar
            await Producto.findOneAndDelete({ _id: id });
            return "Producto Eliminado"
        },
        nuevoCliente: async (_, { input }, ctx) => {
            console.log(ctx);
            const { email } = input;
            //verificar si el cluiente existe
            // console.log(input);
            const cliente = await Cliente.findOne({ email });
            if (cliente) {
                throw new Error("Ese cliente ya esta registrado")
            }

            const nuevoCliente = new Cliente(input);

            //Asignar al vendedor
            nuevoCliente.vendedor = ctx.usuario.id;


            //Guardar en la BD
            try {
                const resultado = await nuevoCliente.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        }

    }
};

module.exports = resolvers;