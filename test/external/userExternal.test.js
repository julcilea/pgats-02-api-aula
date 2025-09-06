// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../app');

// Mock
const userService = require('../../service/userService');

// Testes
describe('User external', () => {
    describe('POST /users/register', () => {

        it('Quando informo usuario inexistentes recebo 400', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/register')
                .send({
                    username: "julio",
                    password: "123456",
                    favorecidos: ["camila"]
            });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário já existe')
        });

    });

    describe('POST /users/login', () => {

        it('Quando informo login inexistentes recebo 400', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/login')
                .send({
                    username: "jansen",
                    password: "126"
            });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário não encontrado')
        });

        it('Quando informo login válidos tenho sucesso com 200', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/login')
                .send({
                    username: "julio",
                    password: "123456"
            });

            expect(resposta.status).to.equal(200);
        });

    });

    describe('GET /users', () => {

        it('Quando solicito os dados de usuarios tenho sucesso com 200', async () => {
            const resposta = await request('http://localhost:3000')
                .get('/users')
                .send();

            expect(resposta.status).to.equal(200);
        });

    });
});