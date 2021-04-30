const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');

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
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }

            //Quien lo crea lo puede ver
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las validaciones');
            }

            return cliente;
        },
        obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosVendedor: async (_, { }, ctx) => {
            try {
                const pedidos = await Pedido.find({ vendedor: ctx.usuario.id });
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido: async (_, { id }, ctx) => {
            //Revisar si el pedido existe
            const pedido = await Pedido.findById(id);
            if (!pedido) {
                throw new Error("Pedido no encontrado")
            }

            //Validacion vendedor
            if (pedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("no tiene credenciales")
            }

            return pedido;
        },
        obtenerPedidosEstado: async (_, { estado }, ctx) => {
            const pedidos = await Pedido.find({ vendedor: ctx.usuario.id, estado });
            return pedidos;
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
        },
        actualizarCliente: async (_, { id, input }, ctx) => {
            //verificar si existe o no
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }

            //verificar si es cliente del vendedor
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las validaciones');
            }

            //Guardar cliente
            cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });
            return cliente;
        },
        eliminarCliente: async (_, { id }, ctx) => {
            //verificar si existe o no
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }

            //verificar si es cliente del vendedor
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes autorización');
            }

            //Eliminar Cliente
            await Cliente.findOneAndDelete({ _id: id });
            return "Cliente eliminado"

        },
        nuevoPedido: async (_, { input }, ctx) => {
            const { cliente } = input;

            //verificar si el cliente existe o no
            let clienteExiste = await Cliente.findById(cliente);
            if (!clienteExiste) {
                throw new Error('Cliente no encontrado');
            }

            //Verificar si el cliente es vendedor
            if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes autorización');
            }

            // Revisar que el stock este disponible
            for await (const articulo of input.pedido) {
                const { id } = articulo;

                const producto = await Producto.findById(id);

                if (articulo.cantidad > producto.existencia) {
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                } else {
                    // Restar la cantidad a lo disponible
                    producto.existencia = producto.existencia - articulo.cantidad;

                    await producto.save();
                }
            }

            // Crear un nuevo pedido
            const nuevoPedido = new Pedido(input);

            // asignarle un vendedor
            nuevoPedido.vendedor = ctx.usuario.id;


            // Guardarlo en la base de datos
            const resultado = await nuevoPedido.save();
            return resultado;
        },
        actualizarPedido: async (_, { id, input }, ctx) => {

            const { cliente } = input;

            // Si el pedido existe
            const existePedido = await Pedido.findById(id);
            if (!existePedido) {
                throw new Error('El pedido no existe');
            }

            // Si el cliente existe
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error('El Cliente no existe');
            }

            // Si el cliente y pedido pertenece al vendedor
            if (existeCliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales');
            }

            // Revisar el stock
            if (input.pedido) {
                for await (const articulo of input.pedido) {
                    const { id } = articulo;

                    const producto = await Producto.findById(id);

                    if (articulo.cantidad > producto.existencia) {
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                    } else {
                        // Restar la cantidad a lo disponible
                        producto.existencia = producto.existencia - articulo.cantidad;

                        await producto.save();
                    }
                }
            }



            // Guardar el pedido
            const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
            return resultado;

        },
        eliminarPedido: async (_, { id }, ctx) => {
            //Verificar si exitste el pedido
            const pedido = await Pedido.findById(id);
            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }

            //validacion cliente vendedor
            if (pedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes autorización');
            }
            //Eliminar
            await Pedido.findOneAndDelete({ _id: id });
            return "Pedido Eliminado"
        }


    }
};

module.exports = resolvers;