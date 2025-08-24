
const { gql } = require('apollo-server-express');
const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwt = require('jsonwebtoken');

const typeDefs = gql`
  type User {
    username: String!
    favorecidos: [String]
  }

  type Transfer {
    from: String!
    to: String!
    value: Float!
    date: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    createUser(username: String!, password: String!, favorecidos: [String]): User
    createTransfer(to: String!, value: Float!): Transfer
  }
`;

const resolvers = {
  Query: {
    users: () => userService.getUsers(),
  },
  Mutation: {
    login: async (_, { username, password }) => {
        const user = await userService.loginUser(username, password);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
        return { token, user };
    },
    createUser: (_, { username, password, favorecidos }) => {
      return userService.createUser({ username, password, favorecidos });
    },
    createTransfer: (_, { to, value }, context) => {
        if (!context.user) {
            throw new Error('Não autorizado');
        }
        const from = context.user.username;
        return transferService.transfer({ from, to, value });
    }
  },
};

module.exports = { typeDefs, resolvers };
