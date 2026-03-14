# BeTalent - Multi Gateway Payment API

## Sobre o projeto

Este projeto consiste em uma API RESTful para gerenciamento de pagamentos utilizando múltiplos gateways.

O sistema permite realizar compras utilizando diferentes gateways de pagamento. Caso o primeiro gateway falhe, o sistema tenta automaticamente o próximo gateway disponível, respeitando a prioridade configurada no banco de dados (estratégia de fallback).

Além do fluxo básico de pagamento, o projeto também contempla funcionalidades adicionais esperadas no nível 2 do desafio, incluindo:

- Autenticação de usuários com geração de Bearer Token

- Proteção das rotas sensíveis utilizando middleware de autenticação

- Implementação de reembolso de transações, enviando a solicitação para o mesmo gateway responsável pelo pagamento original

O sistema também permite que uma transação contenha múltiplos produtos, sendo que o valor total da compra é calculado internamente pelo backend, garantindo maior segurança e evitando manipulação de valores pelo cliente.

Para simplificação do escopo do teste, considera-se que os clientes já estão previamente cadastrados no banco de dados, sendo utilizados apenas como referência no momento da criação das transações.

---

# Tecnologias utilizadas

- Node.js
- AdonisJS 5+
- MySQL
- Lucid ORM
- Axios
- JSON Web Token (JWT) para autenticação
- Docker (para execução dos gateways mock)

---

# Estrutura do banco de dados

O sistema utiliza as seguintes tabelas:

### users

- name
- email
- password
- role

### gateways

- name
- is_active
- priority

### clients

- name
- email

### products

- name
- amount

### transactions

- client_id
- gateway_id
- external_id
- status
- amount
- card_last_numbers

### transaction_products

- transaction_id
- product_id
- quantity

---

# Fluxo de pagamento

1. O cliente realiza uma compra informando os produtos e quantidades.
2. O backend calcula o valor total da compra com base nos produtos.
3. O sistema busca os gateways ativos ordenados por prioridade.
4. O pagamento é tentado no primeiro gateway.
5. Caso o gateway falhe, o sistema tenta automaticamente o próximo.
6. Quando um gateway retorna sucesso:
   - a transação é salva no banco
   - as informações da compra são registradas nas tabelas `transactions` e `transaction_products`

---

# Integração com Gateways

O sistema integra com dois gateways externos fornecidos no teste.

Gateway 1:

```
http://localhost:3001
```

Gateway 2:

```
http://localhost:3002
```

Caso o primeiro gateway falhe, o sistema automaticamente tenta o segundo.

---

# Como rodar o projeto

## 1 - Clonar o repositório

```
git clone <url-do-repositorio>
```

---

## 2 - Instalar dependências

```
npm install
```

---

## 3 - Configurar variáveis de ambiente

Criar arquivo `.env` com as configurações do banco MySQL.

Exemplo:

```
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_DATABASE=betalant_test
```

---

## 4 - Rodar migrations

```
npm run ace migration:run
```

---

## 5 - Rodar seeders

```
npm run ace db:seed
```

Isso irá criar os gateways iniciais no banco.

---

## 6 - Subir os gateways mock

```
docker run -p 3001:3001 -p 3002:3002 -e REMOVE_AUTH='true' matheusprotzen/gateways-mock
```

---

## 7 - Iniciar a aplicação

```
npm run dev
```

A API ficará disponível em:

```
http://localhost:3333
```

---

# Rotas Públicas da API

## Login

Para acessar rotas administrativas foi implementado um endpoint de autenticação simples.

## Usuário inicial

Para facilitar os testes da aplicação, um usuário administrativo é criado através de seed do banco de dados.

```
email: admin@email.com
password: 123456
role: ADMIN
```

Esse usuário pode ser utilizado para autenticação e acesso às rotas administrativas.

```
POST /login
```

### Body

```
{
  "email": "admin@email.com",
  "password": "123456"
}
```

---

## Realizar compra

```
POST /transactions
```

### Body

```
{
  "clientId": 1,
  "cardNumber": "5569000000006063",
  "cvv": "010",
  "products": [
    {
      "id": 1,
      "quantity": 2
    }
  ]
}
```

# Rotas Privadas da API

## Listar produtos

```
GET /products
```

---

## Listar clientes

```
GET /clients
```

Para simplificação do escopo do teste técnico, os clientes são considerados previamente cadastrados no sistema.

---

## Listar transações

```
GET /transactions
```

## Reembolsar transação

```
POST /transactions/:id/refund
```

### Descrição

Realiza o reembolso de uma transação previamente registrada.

O sistema identifica automaticamente qual gateway foi utilizado na transação original e envia a requisição de reembolso para o mesmo gateway.

Após o sucesso da operação:

- o status da transação é atualizado para `refunded`
- a alteração é persistida no banco de dados

---

# Possíveis melhorias

Algumas melhorias planejadas para evolução do projeto:

- Validação de dados utilizando VineJS
- Testes automatizados (TDD)
- Docker Compose para orquestração completa do ambiente
