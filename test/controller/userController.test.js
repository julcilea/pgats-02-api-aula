// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../app');

// Mock
const userService = require('../../service/userService');

// Testes
describe('User Controller', () => {
    describe('POST /users/register', () => {

        it('Quando informo usuario inexistentes recebo 400', async () => {
            const resposta = await request(app)
                .post('/users/register')
                .send({
                    username: "julio",
                    password: "123456",
                    favorecidos: ["priscila"]
            });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário já existe')
        });

        it('Quando informo valores válidos de usuários eu tenho sucesso com 201 CREATED', async () => {
            const resposta = await request(app)
                .post('/users/register')
                .send({
                    username: "julcilea",
                    password: "123456",
                    favorecidos: ["renata"]
            });
            
            expect(resposta.status).to.equal(201);
            const usuarioCriado = require('../fixture/respostas/quandoInformoValoresValidosUsuariosEuTenhoSucesso201Created.json');
            expect(resposta.body).to.deep.equal(usuarioCriado);

        });

        afterEach(() => {
            sinon.restore();
        });
    });

    describe('POST /users/login', () => {

        it('Quando informo login inexistentes recebo 400', async () => {
            const resposta = await request(app)
                .post('/users/login')
                .send({
                    username: "maria",
                    password: "123456"
            });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário não encontrado')
        });

        it('Quando informo login válidos tenho sucesso com 200', async () => {
            const resposta = await request(app)
                .post('/users/login')
                .send({
                    username: "julio",
                    password: "123456"
            });
            
            expect(resposta.status).to.equal(200);
            const respostaLogin = require('../fixture/respostas/quandoInformoLoginValidoTenhoSucesso200.json');
            delete resposta.body.token;
            delete respostaLogin.token;
            expect(resposta.body).to.deep.equal(respostaLogin);

        });

        afterEach(() => {
            sinon.restore();
        });
    });

    describe('GET /users', () => {

        it('Quando solicito so dados de usuarios tenho sucesso com 200', async () => {
            const resposta = await request(app)
                .get('/users')
                .send();
            
            expect(resposta.status).to.equal(200);
            const respostaCadastro = require('../fixture/respostas/quandoSolicitoDadosDosUsuariosEuTenhoSucesso200.json');
            expect(resposta.body).to.deep.equal(respostaCadastro);

        });

        afterEach(() => {
            sinon.restore();
        });
    });
});