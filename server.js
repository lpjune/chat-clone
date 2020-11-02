require('dotenv').config()

const { ApolloServer } = require("apollo-server");
const { sequelize } = require("./models");

// The GraphQL schema
const typeDefs = require("./graphql/typeDefs");

// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");

const contextMiddleware = require("./util/contextMiddleware")

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware,
    subscriptions: { path: "/"}
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);

    sequelize
        .authenticate()
        .then(() => console.log("Database connected!"))
        .catch((err) => console.log(err));
});
