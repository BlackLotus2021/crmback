const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers')
const jwt = require('jsonwebtoken');
const conectarDB = require('./config/db')
require('dotenv').config({ path: 'variables.env' });

//Conectar a la BD
conectarDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // console.log(req.headers['authorization'])
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = jwt.verify(token, process.env.SECRETA);
                console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log('Hubo un error');
                console.log(error);
            }
        }
    }

});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});