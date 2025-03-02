# Feedback API

Esta API permite o gerenciamento de feedbacks coletados por meio de um widget que pode ser integrado a sites de terceiros. Também disponibiliza funcionalidades para autenticação de usuários e gestão de feedbacks.

## 🚀 Tecnologias Utilizadas
- Node.js
- Express
- JWT (JSON Web Token) para autenticação
- Banco de dados mockado (dados fictícios para testes)

## 📌 Funcionalidades
- Cadastro e autenticação de usuários
- Geração de API Key para integração
- Envio de feedbacks via widget
- Listagem de feedbacks recebidos

## 🔑 Autenticação
A API utiliza JWT para autenticação. Ao fazer login, o usuário recebe um token que deve ser enviado no cabeçalho `Authorization` em requisições autenticadas.

**Exemplo de cabeçalho:**
```sh
Authorization: Bearer
```
