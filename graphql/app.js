
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./schema').typeDefs;
const resolvers = require('./schema').resolvers;
const jwt = require('jsonwebtoken');

const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');
        return { user };
      } catch (e) {
        console.log(e);
      }
    }
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer();

module.exports = app;
