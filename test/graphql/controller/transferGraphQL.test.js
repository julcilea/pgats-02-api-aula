const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../graphql/app');

describe('GraphQL Transfer Mutations', () => {
  let token = null;

  // Antes de todos os testes, realiza login e captura token
  before(async () => {
    const loginMutation = {
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
        username: "julio",
        password: "123456"
      }
    };

    const res = await request(app)
      .post('/graphql')
      .send(loginMutation);

    if (res.body.errors) {
      console.error('Erro ao fazer login:', res.body.errors);
      throw new Error('Falha no login, verifique os dados de login ou o userService.js');
    }

    token = res.body.data.loginUser.token;
  });

  it('Remetente ou destinatário inexistentes retorna erro', async () => {
    const createTransferMutation = {
      query: `
        mutation {
          createTransfer(from: "julio", to: "isabelle", value: 100) {
            from
            to
            value
          }
        }
      `
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(createTransferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.errors[0].message).to.equal('Usuário remetente ou destinatário não encontrado');
  });

  it('Transferência com sucesso', async () => {
    const createTransferMutation = {
      query: `
        mutation {
          createTransfer(from: "julio", to: "priscila", value: 100) {
            from
            to
            value
          }
        }
      `
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(createTransferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.data.createTransfer).to.deep.equal({
      from: 'julio',
      to: 'priscila',
      value: 100
    });
  });

  it('Sem token de autenticação retorna erro', async () => {
    const createTransferMutation = {
      query: `
        mutation {
          createTransfer(from: "julio", to: "priscila", value: 50) {
            from
            to
            value
          }
        }
      `
    };

    const res = await request(app)
      .post('/graphql')
      .send(createTransferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.errors[0].message).to.equal('Autenticação obrigatória');
  });

  it('Deve retornar erro ao tentar transferir valor maior que o saldo disponível', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            createTransfer(from: "julio", to: "priscila", value: 10000.01) {
              from
              to
              value
            }
          }
        `
      });

    expect(response.status).to.equal(200);
    expect(response.body.errors).to.be.an('array');
    expect(response.body.errors[0].message).to.equal('Saldo insuficiente');
  });

  it('Deve impedir transferência acima de R$ 5.000,00 para usuários que não são favorecidos', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            createTransfer(from: "julio", to: "renata", value: 5000.01) {
              from
              to
              value
            }
          }
        `
      });

    expect(response.status).to.equal(200);
    expect(response.body.errors).to.be.an('array');
    expect(response.body.errors[0].message).to.equal(
      'Transferência acima de R$ 5.000,00 só para favorecidos'
    );
  });

  it('Deve permitir transferência acima de R$ 5.000,00 para favorecidos', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation {
            createTransfer(from: "julio", to: "priscila", value: 5000.01) {
              from
              to
              value
            }
          }
        `
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.createTransfer).to.have.property('from', 'julio');
    expect(response.body.data.createTransfer).to.have.property('to', 'priscila');
    expect(response.body.data.createTransfer).to.have.property('value', 5000.01);
  });

});