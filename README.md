# BeTalent - Multi Gateway Payment API

## Sobre o projeto

Este projeto consiste em uma API RESTful para gerenciamento de pagamentos utilizando múltiplos gateways.
A API foi desenvolvida como parte do teste técnico da BeTalent.

O sistema permite realizar compras utilizando diferentes gateways de pagamento. Caso o primeiro gateway falhe, o sistema tenta automaticamente o próximo gateway disponível, respeitando a prioridade configurada no banco de dados.

A arquitetura foi pensada para permitir a adição de novos gateways de forma simples e modular.

---

# Tecnologias utilizadas

- Node.js
- AdonisJS 5+
- MySQL
- Lucid ORM
- Axios
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
DB_USER=root
DB_PASSWORD=
DB_DATABASE=betalant_test
```

---

## 4 - Rodar migrations

```
node ace migration:run
```

---

## 5 - Rodar seeders

```
node ace db:seed
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

# Rotas da API

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

---

## Listar produtos

```
GET /products
```

---

## Listar clientes

```
GET /clients
```

---

## Listar transações

```
GET /transactions
```

---

# Observações

- O valor da compra é sempre calculado no backend.
- Apenas os últimos 4 dígitos do cartão são armazenados.
- O sistema suporta múltiplos produtos por transação.
- A arquitetura permite adicionar novos gateways facilmente através da tabela `gateways`.

---

# Possíveis melhorias

Algumas melhorias planejadas para evolução do projeto:

- Implementação de autenticação de usuários
- Controle de acesso por roles
- Endpoint de reembolso de transações
- Validação de dados utilizando VineJS
- Testes automatizados (TDD)
- Docker Compose para orquestração completa do ambiente

---

# Autora

Melissa Sequeira
