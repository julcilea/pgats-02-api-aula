const request = require('supertest');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude);

require('dotenv').config();


describe('GraphQL Transfer Mutations external', () => {

  before(async () => {
    const loginUser = require('../fixture/require/login/loginUser.json');
    const resposta = await request(process.env.BASE_URL_GRAPHQL)
      .post('')
      .send(loginUser);

    if (resposta.body.errors) {
      console.error('Erro ao fazer login:', resposta.body.errors);
      throw new Error('Falha no login, verifique os dados de login ou o userService.js');
    }

    token = resposta.body.data.loginUser.token;
  });

  beforeEach(() => {
    createTransfer = require('../fixture/require/transfer/createTransfer.json');
  });


  it('Validar que transferencia entre dois usuarios com sucesso', async () => {
    const responsaEsperada = require('../fixture/response/transfer/ValidarQueTransferenciaEntreDoisUsuariosComSucesso.json');
    const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send(createTransfer);

    expect(respostaTransferencia.status).to.equal(200);
    expect(respostaTransferencia.body.data.createTransfer).excluding('date').to.deep.equal(responsaEsperada.data.createTransfer);

  });

  it('Validar que não é possivel transferir de uma conta sem saldo suficiente', async () => {
    createTransfer.variables.value = 10000.01;
    const responsaEsperada = require('../fixture/response/transfer/ValidarNaoEPossivelTransferirDeUmaContaSemSaldoSuficiente.json');

    const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send(createTransfer);

    expect(respostaTransferencia.status).to.equal(200);
    expect(respostaTransferencia.body.errors[0].message).to.deep.equal(responsaEsperada.errors[0].message);
  });
});