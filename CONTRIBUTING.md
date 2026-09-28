# 🤝 Guia de Contribuição — BarberPro

Obrigado por contribuir com o **BarberPro**.

Este documento define as principais regras para desenvolvimento, organização do código, commits, branches e Pull Requests do projeto.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Configuração do Ambiente](#-configuração-do-ambiente)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Fluxo de Trabalho com Git](#-fluxo-de-trabalho-com-git)
5. [Padrão de Commits](#-padrão-de-commits)
6. [Pull Requests](#-pull-requests)
7. [Boas Práticas](#-boas-práticas)
8. [Issues](#-issues)

---

## ⚙️ Pré-requisitos

Antes de iniciar o desenvolvimento, certifique-se de possuir:

* **Node.js** 18 ou superior
* **npm** ou outro gerenciador de pacotes compatível
* **PostgreSQL** 14 ou superior
* **Git**
* Editor de código, preferencialmente **Visual Studio Code**

Verifique as versões instaladas:

```bash
node --version
npm --version
git --version
```

---

## 💻 Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/dferreiraz/barberpro.git
cd barberpro
```

### 2. Configure o Backend

Entre na pasta do servidor:

```bash
cd server
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

> No Windows, você também pode criar o arquivo `.env` manualmente a partir do `.env.example`.

Configure no `.env` as variáveis necessárias para o funcionamento da aplicação, incluindo as informações de conexão com o PostgreSQL.

Depois, execute o servidor:

```bash
npm run dev
```

### 3. Configure o Frontend

Abra outro terminal e entre na pasta do cliente:

```bash
cd client
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Inicie o projeto:

```bash
npm run dev
```

Por padrão, o ambiente de desenvolvimento utiliza:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3333
```

> As portas podem variar de acordo com a configuração atual do projeto.

---

## 📂 Estrutura do Projeto

O BarberPro utiliza uma estrutura separada entre Frontend e Backend:

```text
barberpro/
│
├── client/                         # Frontend
│   ├── src/
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── pages/                  # Páginas da aplicação
│   │   ├── services/               # Comunicação com a API
│   │   └── store/                  # Gerenciamento de estado
│   │
│   └── vite.config.js
│
├── server/                         # Backend
│   ├── src/
│   │   ├── config/                 # Configurações da aplicação
│   │   ├── controllers/            # Controllers
│   │   ├── middlewares/             # Middlewares
│   │   ├── repositories/            # Acesso aos dados
│   │   ├── routes/                  # Rotas da API
│   │   └── services/                # Regras de negócio
│   │
│   └── .env
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

A estrutura pode evoluir conforme novas funcionalidades forem adicionadas.

---

## 🌿 Fluxo de Trabalho com Git

O desenvolvimento deve ser realizado utilizando branches específicas para cada alteração.

### 1. Atualize a branch de desenvolvimento

```bash
git checkout develop
git pull origin develop
```

### 2. Crie uma nova branch

Utilize um prefixo de acordo com o tipo de alteração:

```bash
git checkout -b feat/nome-da-feature
```

Exemplos:

```text
feat/authentication
feat/appointment-management
fix/login-validation
fix/appointment-date
docs/update-readme
refactor/user-service
chore/update-dependencies
```

### 3. Desenvolva e teste

Faça as alterações necessárias e certifique-se de que o projeto continua funcionando corretamente.

### 4. Verifique os arquivos alterados

```bash
git status
```

### 5. Adicione as alterações

```bash
git add .
```

### 6. Crie o commit

```bash
git commit -m "feat: descrição da alteração"
```

### 7. Envie a branch

```bash
git push origin nome-da-branch
```

### 8. Abra um Pull Request

O Pull Request deve ser direcionado para a branch `develop`.

---

## 📝 Padrão de Commits

O projeto utiliza o padrão **Conventional Commits**.

Formato:

```text
tipo(escopo): descrição
```

### Tipos

| Tipo       | Utilização                                |
| ---------- | ----------------------------------------- |
| `feat`     | Nova funcionalidade                       |
| `fix`      | Correção de bug                           |
| `docs`     | Alterações na documentação                |
| `style`    | Formatação sem alteração de comportamento |
| `refactor` | Refatoração de código                     |
| `test`     | Criação ou alteração de testes            |
| `chore`    | Configurações e tarefas de manutenção     |

### Exemplos

```text
feat: adicionar autenticação de usuários
```

```text
feat(appointments): adicionar criação de agendamento
```

```text
fix(auth): corrigir validação do login
```

```text
docs: atualizar documentação da API
```

```text
refactor(users): reorganizar serviço de usuários
```

```text
chore: atualizar dependências
```

### Boas práticas

* Utilize mensagens objetivas.
* Escreva o commit no infinitivo.
* Evite mensagens genéricas como `update`, `changes` ou `fix`.
* Um commit deve representar uma alteração lógica.
* Não inclua informações sensíveis nos commits.

---

## 🚀 Pull Requests

Antes de abrir um Pull Request:

* Verifique se o projeto está funcionando.
* Teste a funcionalidade desenvolvida.
* Revise o próprio código.
* Remova códigos de debug desnecessários.
* Verifique se não existem credenciais ou informações sensíveis.
* Confirme que a branch está atualizada com `develop`.

### O Pull Request deve informar

**Descrição**

Explique de forma objetiva o que foi alterado.

**Alterações**

Liste as principais mudanças realizadas.

**Como testar**

Explique os passos necessários para validar a funcionalidade.

**Imagens**

Para alterações visuais no Frontend, adicione screenshots ou outras evidências quando necessário.

### Exemplo

```text
## Descrição

Adiciona o gerenciamento de agendamentos no painel administrativo.

## Alterações

- Criação da página de agendamentos
- Criação das rotas da API
- Integração entre Frontend e Backend
- Validação dos dados

## Como testar

1. Inicie o Backend
2. Inicie o Frontend
3. Acesse o painel administrativo
4. Crie um novo agendamento
5. Verifique o registro na lista de agendamentos
```

---

## ✅ Boas Práticas

### Código

* Mantenha funções pequenas e objetivas.
* Utilize nomes claros para variáveis, funções e componentes.
* Evite duplicação de código.
* Separe responsabilidades.
* Não coloque regras de negócio diretamente nas rotas.
* Reutilize componentes quando fizer sentido.

### Frontend

* Priorize componentes reutilizáveis.
* Mantenha a lógica de comunicação com a API organizada em `services`.
* Evite componentes excessivamente grandes.
* Garanta responsividade.
* Mantenha uma estrutura consistente entre páginas e componentes.

### Backend

* Mantenha as responsabilidades separadas entre `routes`, `controllers`, `services` e `repositories`.
* Valide os dados recebidos pela API.
* Utilize códigos HTTP apropriados.
* Trate erros de forma consistente.
* Nunca exponha informações sensíveis nas respostas da API.

### Segurança

Nunca envie para o Git:

```text
.env
senhas
tokens
API keys
credenciais do banco de dados
chaves privadas
```

Essas informações devem estar protegidas pelo `.gitignore` e configuradas localmente por meio das variáveis de ambiente.

---

## 🐛 Issues

Utilize Issues para registrar:

* Bugs
* Sugestões de funcionalidades
* Melhorias
* Problemas de documentação
* Tarefas técnicas

Ao abrir uma Issue, forneça o máximo de contexto possível.

### Para bugs

Informe:

```text
## Descrição

Descreva o problema.

## Passos para reproduzir

1. ...
2. ...
3. ...

## Resultado esperado

O que deveria acontecer.

## Resultado atual

O que está acontecendo.

## Ambiente

Sistema operacional:
Node.js:
Navegador:
Versão do projeto:
```

---

## 📌 Regras Importantes

* Não faça commit diretamente na `main`.
* Evite fazer commit diretamente na `develop`.
* Crie uma branch para cada funcionalidade, correção ou alteração significativa.
* Não envie arquivos `.env`.
* Não envie credenciais ou informações sensíveis.
* Mantenha os commits organizados.
* Teste suas alterações antes de abrir um Pull Request.
* Mantenha a documentação atualizada quando necessário.

---

## 💈 Obrigado por contribuir!

Toda contribuição ajuda a melhorar o **BarberPro**.

Antes de começar uma alteração maior, consulte a documentação do projeto e, quando necessário, abra uma Issue para discutir a implementação.
