# API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários. O objetivo é servir de base para estudos de testes e automação de APIs.

## Tecnologias
- Node.js
- Express
- Swagger (documentação)
- Banco de dados em memória (variáveis)

## Instalação

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd pgats-02-api
   ```
2. Instale as dependências:
   ```sh
   npm install express swagger-ui-express bcryptjs
   ```
## Confoguração

Antes de seguir crie um arquivo .env na pasta raiz contendo as propriedades BASE_URL_REST e BASE_URL_GRAPHQL com a URL deste serviço.


## Como rodar

### API REST

- Para iniciar o servidor:
  ```sh
  node server.js
  ```
- A API estará disponível em `http://localhost:3000`
- A documentação Swagger estará em `http://localhost:3000/api-docs`

### API GraphQL

- Para iniciar o servidor:
  ```sh
  node graphql/server.js
  ```
- A API estará disponível em `http://localhost:4000/graphql`

## Endpoints principais

### Registro de usuário
- `POST /users/register`
  - Body: `{ "username": "string", "password": "string", "favorecidos": ["string"] }`

### Login
- `POST /users/login`
  - Body: `{ "username": "string", "password": "string" }`

### Listar usuários
- `GET /users`

### Transferências
- `POST /transfers`
  - Body: `{ "from": "string", "to": "string", "value": number }`
- `GET /transfers`

## Regras de negócio
- Não é permitido registrar usuários duplicados.
- Login exige usuário e senha.
- Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos.
- O saldo inicial de cada usuário é de R$ 10.000,00.

## Testes

- O arquivo `app.js` pode ser importado em ferramentas de teste como Supertest.

```bash
npm run test
```

## Testes de Controller

- Localizados em test/controller. Testam endpoints internos ou lógicas específicas de controllers.

```bash
npm run test-controller
```

## Testes externos

- Localizados em test/external. Testam endpoints REST expostos da API.

```bash
npm run test-external
```

## Testes GraphQL

Os testes GraphQL estão localizados em `test/external-graphql`.  

Para rodar os testes:

```bash
npm run test-graphql
```

Para dúvidas, consulte a documentação Swagger ou o código-fonte.
