
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
        obtenerCategoria: () => productos,
        obtenerCategoriaInput: (_, { input },ctx) => {
            console.log(ctx);
            const resultado = productos.filter(producto => producto.categoria === input.categoria);
            return resultado;
        }
    },
};

module.exports = resolvers;