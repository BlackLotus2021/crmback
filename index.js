const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers')



const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        const miContext = "test";
        return { miContext }
    }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});