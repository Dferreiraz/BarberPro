# 🏗️ Architecture - BarberPro

## Visão Geral
Sistema full-stack de gestão para barbearias, construído com arquitetura limpa (Clean Architecture) e princípios SOLID.

---

## Stack Tecnológico

### Frontend
- **React 18** com Vite
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Axios** para requisições HTTP
- **Zustand** para gerenciamento de estado
- **React Hook Form** + **Zod** para validação

### Backend
- **Node.js 22** com Express
- **PostgreSQL** (Neon/Supabase) para banco de dados
- **JWT** para autenticação
- **Nodemailer** para e-mails
- **Twilio API** para WhatsApp (opcional)

### Infraestrutura
- **Docker** e **Docker Compose**
- **Render** para deploy
- **Neon** para PostgreSQL cloud

---

## Estrutura de Diretórios

```text
BarberPro/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de roteamento HTTP
│   │   ├── services/         # Regras de negócio
│   │   ├── repositories/     # Acesso ao banco de dados
│   │   ├── middlewares/      # Auth, validation, error handling
│   │   ├── routes/           # Definição de rotas
│   │   ├── utils/            # Funções auxiliares
│   │   ├── database/         # Configuração do Pool PostgreSQL
│   │   └── server.js         # Entry point
│   ├── tests/                # Testes automatizados (Jest)
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Chamadas à API
│   │   ├── store/            # Zustand store
│   │   └── App.jsx
│   └── package.json
├── database/
│   └── schema.sql            # Schema do PostgreSQL
├── docs/                     # Documentação
├── docker-compose.yml
└── README.md

```

---

## Fluxo de Dados

### Agendamento de Horário

1. **Cliente seleciona serviço** → Frontend busca serviços disponíveis
2. **Cliente escolhe barbeiro** → Frontend busca horários livres (`GET /barbers/:id/schedule`)
3. **Cliente confirma agendamento** → `POST /appointments`
4. **Backend valida disponibilidade** → Repository verifica conflitos
5. **Backend cria agendamento** → `INSERT INTO appointments`
6. **Backend envia notificação** → Service de notificações (e-mail/WhatsApp)
7. **Frontend atualiza lista** → `GET /appointments`

---

## Camadas da Arquitetura

### 1. Controller Layer

* Recebe requisições HTTP
* Valida dados de entrada
* Chama Services
* Retorna respostas HTTP

### 2. Service Layer

* Contém regras de negócio
* Orquestra múltiplos Repositories
* Lida com transações
* Exemplo: `AppointmentService.createAppointment()`

### 3. Repository Layer

* Acesso exclusivo ao banco de dados
* Queries SQL
* Retorna dados brutos
* Exemplo: `AppointmentRepository.findByDate()`

### 4. Middleware Layer

* Autenticação JWT
* Validação de dados (Zod)
* Tratamento de erros
* Logging

---

## Padrões de Design

### Repository Pattern

Isola o acesso ao banco de dados, facilitando testes e manutenção.

```javascript
// Repository
class AppointmentRepository {
  async findByDate(date, barberId) {
    const { rows } = await pool.query(
      'SELECT * FROM appointments WHERE date = $1 AND barber_id = $2',
      [date, barberId]
    );
    return rows;
  }
}

// Service
class AppointmentService {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  async createAppointment(data) {
    // Valida disponibilidade
    const existing = await this.appointmentRepo.findByDate(data.date, data.barber_id);
    if (existing.length > 0) {
      throw new Error('Horário indisponível');
    }
    // Cria agendamento
    return await this.appointmentRepo.create(data);
  }
}

```

### Dependency Injection

Services recebem Repositories via construtor, facilitando testes automatizados e o mock de dependências.

---

## Segurança

### Autenticação

* JWT com refresh token
* Senhas hasheadas com bcrypt (10 rounds)
* Middleware de autenticação em rotas protegidas

### Validação

* Zod schema validation em todos os inputs
* Sanitização de dados para prevenir SQL injection
* Rate limiting em endpoints críticos

### Autorização

* Roles: `admin`, `barber`, `client`
* Middleware de autorização verifica permissões (Ex: apenas admin pode deletar usuários)

---

## Escalabilidade

### Horizontal

* Stateless API (JWT não requer sessão armazenada no backend)
* Pool de conexões PostgreSQL
* Cache de consultas frequentes (Redis - previsto para o futuro)

### Vertical

* Índices otimizados no banco de dados
* Queries SQL refinadas
* Paginação em todas as listagens grandes

```