// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../app');

// Mock
const transferService = require('../../service/transferService');

// Testes
describe('Transfer Controller', () => {
    describe('POST /transfers', () => {

        let token = null;
        
        beforeEach(async() => {
            // 1) Capturar o Token
            const respostaLogin = await request(app)
                .post('/users/login')
                .send({
                    username: 'julio',
                    password: '123456'
        });
                    
        token = respostaLogin.body.token;

        });

        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "juliana",
                    to: "maria",
                    value: 100
                });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });

        it('Usando Mocks: Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            // Mocar apenas a função transfer do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário remetente ou destinatário não encontrado'));

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscila",
                    value: 100
                });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')

        });

        it('Usando Mocks: Quando informo valores válidos eu tenho sucesso com 201 CREATED', async () => {
            // Mocar apenas a função transfer do Service
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({ 
                from: "julio", 
                to: "priscila", 
                value: 100, 
                date: new Date().toISOString() 
            });

            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscilaaaaaaaaaaa",
                    value: 100
                });
            
            expect(resposta.status).to.equal(201);
            
            // Validação com um Fixture
            const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidosEuTenhoSucessoCom201Created.json')
            delete resposta.body.date;
            delete respostaEsperada.date; 
            expect(resposta.body).to.deep.equal(respostaEsperada);

            // Um expect para comparar a Resposta.body com a String contida no arquivo
            // expect(resposta.body).to.have.property('from', 'julio');
            // expect(resposta.body).to.have.property('to', 'priscila');
            // expect(resposta.body).to.have.property('value', 100);
        });

        it('Transferência acima de R$ 5.000,00 para não favorecido deve falhar (400)', async () => {
            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "renata", 
                    value: 5000.01
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Transferência acima de R$ 5.000,00 só para favorecidos');
        });

        it('Transferência acima de R$ 5.000,00 para favorecido deve ter sucesso (201)', async () => {
            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscila",
                    value: 5000.01
                });

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('from', 'julio');
            expect(resposta.body).to.have.property('to', 'priscila');
            expect(resposta.body).to.have.property('value', 5000.01);
        });

        it('Transferência com valor maior que o saldo deve falhar (400)', async () => {
            const resposta = await request(app)
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "priscila",
                    value: 10000.01 // saldo insuficiente
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Saldo insuficiente');
        });

        afterEach(() => {
            // Reseto o Mock
            sinon.restore();
        });
    });

    describe('GET /transfers', () => {
        let token = null;
        
        beforeEach(async() => {
            // 1) Capturar o Token
            const respostaLogin = await request(app)
                .post('/users/login')
                .send({
                    username: 'julio',
                    password: '123456'
        });
                    
        token = respostaLogin.body.token;

        });
        
        it('Quando solicito as transferências tenho sucesso com 200', async () => {
            const resposta = await request(app)
                .get('/transfers')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.be.an('array');
        });
    });
});