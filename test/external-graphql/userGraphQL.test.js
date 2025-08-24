const request = require('supertest');
const { expect } = require('chai');
const app = require('../../graphql/app');

describe('GraphQL User Mutations & Queries', () => {
  let token;

  // Teste de registro de usuário
  describe('registerUser', () => {

    it('Quando informo usuario já existente recebo erro', async () => {
      const mutation = {
        query: `
          mutation RegisterUser($username: String!, $password: String!, $favorecidos: [String!]) {
            registerUser(username: $username, password: $password, favorecidos: $favorecidos) {
              username
            }
          }
        `,
        variables: {
          username: 'julio',
          password: '123456',
          favorecidos: ['camila']
        }
      };

      const res = await request(app)
        .post('/graphql')
        .send(mutation);

      expect(res.body.errors[0].message).to.equal('Usuário já existe');
    });

  });

  // Teste de login
  describe('loginUser', () => {

    it('Quando informo login inexistente recebo erro', async () => {
      const mutation = {
        query: `
          mutation LoginUser($username: String!, $password: String!) {
            loginUser(username: $username, password: $password) {
              token
            }
          }
        `,
        variables: {
          username: 'jansen',
          password: '126'
        }
      };

      const res = await request(app)
        .post('/graphql')
        .send(mutation);

      expect(res.body.errors[0].message).to.equal('Usuário não encontrado');
    });

    it('Quando informo login válido recebo token', async () => {
      const mutation = {
        query: `
          mutation LoginUser($username: String!, $password: String!) {
            loginUser(username: $username, password: $password) {
              token
              user {
                username
              }
            }
          }
        `,
        variables: {
          username: 'julio',
          password: '123456'
        }
      };

      const res = await request(app)
        .post('/graphql')
        .send(mutation);

      expect(res.body.data.loginUser.token).to.exist;
      token = res.body.data.loginUser.token;
    });

  });

  // Teste de listagem de usuários
  describe('users Query', () => {

    it('Quando solicito os dados de usuarios recebo lista', async () => {
      const query = {
        query: `
          query {
            users {
              username
              saldo
              favorecidos
            }
          }
        `
      };

      const res = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send(query);

      expect(res.body.data.users).to.be.an('array');
      expect(res.body.data.users[0]).to.have.property('username');
    });

  });

});