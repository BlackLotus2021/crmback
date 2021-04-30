const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers')

const conectarDB = require( './config/db')

//Conectar a la BD
conectarDB();

const server = new ApolloServer({
    typeDefs,
    resolvers

});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});