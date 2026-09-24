Combinado, Davi! Vou corrigir, padronizar a formatação, consertar os espaçamentos irregulares e preencher as informações que estavam faltando (como os exemplos de `Body` e `Response` nas rotas que estavam vazias) para deixar a documentação 100% completa.

Aqui está o **1º arquivo** corrigido:

### 📄 1. `docs/api.md`

```markdown
# 📄 API Documentation - BarberPro

## 🌐 Base URL
```text
Desenvolvimento: http://localhost:3000/api
Produção: [https://barberpro.onrender.com/api](https://barberpro.onrender.com/api)

```

## 🔑 Autenticação Geral

Todas as rotas protegidas requerem o envio do token JWT no header da requisição:

```http
Authorization: Bearer <token>

```

---

## 🔐 Autenticação

### POST /auth/register

Registra um novo usuário (cliente ou barbeiro).

**Body:**

```json
{
  "name": "Davi Ferreira",
  "email": "davi@example.com",
  "password": "senha123",
  "role": "client" // "client" ou "barber"
}

```

**Response:** `201 Created`

```json
{
  "id": 1,
  "name": "Davi Ferreira",
  "email": "davi@example.com",
  "role": "client",
  "token": "jwt_token_here"
}

```

### POST /auth/login

Autentica o usuário e retorna o token JWT.

**Body:**

```json
{
  "email": "davi@example.com",
  "password": "senha123"
}

```

**Response:** `200 OK`

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Davi Ferreira",
    "role": "client"
  }
}

```

---

## 📅 Agendamentos

### GET /appointments

Lista agendamentos (com paginação e filtros).

**Query Params:**

* `page` (default: 1)
* `limit` (default: 10)
* `status` (pending, confirmed, completed, cancelled)
* `barber_id` (filtro por barbeiro)
* `date` (filtro por data: YYYY-MM-DD)

**Response:** `200 OK`

```json
{
  "appointments": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalAppointments": 50
  }
}

```

### POST /appointments

Cria um novo agendamento.

**Body:**

```json
{
  "client_id": 1,
  "barber_id": 2,
  "service_id": 3,
  "date": "2026-09-20",
  "time": "14:30",
  "notes": "Preferência por corte degradê"
}

```

**Response:** `201 Created`

```json
{
  "id": 15,
  "client_id": 1,
  "barber_id": 2,
  "service_id": 3,
  "date": "2026-09-20",
  "time": "14:30",
  "status": "pending_payment", 
  "total_price": 45.00,
  "whatsapp_redirect": "https://wa.me/5511999999999?text=Olá%20BarberPro!%20Gostaria%20de%20finalizar%20meu%20agendamento%20(ID:%2015)%20e%20definir%20a%20forma%20de%20pagamento."
}

```

### PUT /appointments/:id

Atualiza um agendamento (alterar horário, status, notas).

**Body:**

```json
{
  "status": "confirmed",
  "time": "15:00"
}

```

**Response:** `200 OK`

```json
{
  "id": 15,
  "status": "confirmed",
  "time": "15:00",
  "updated_at": "2026-09-15T17:30:00Z"
}

```

### DELETE /appointments/:id

Cancela um agendamento.

**Response:** `204 No Content`

---

## 👥 Clientes

### GET /clients

Lista todos os clientes (Acesso: admin/barber).

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Davi Ferreira",
    "email": "davi@example.com",
    "phone": "11999999999"
  }
]

```

### POST /clients

Cadastra um novo cliente manualmente (geralmente usado via `/auth/register`, mas útil para o admin/recepção).

### GET /clients/:id

Traz os detalhes de um cliente específico junto com seu histórico de agendamentos.

### PUT /clients/:id

Atualiza informações cadastrais do cliente.

---

## 💈 Profissionais (Barbeiros)

### GET /barbers

Lista todos os barbeiros disponíveis.

**Response:** `200 OK`

```json
[
  {
    "id": 2,
    "name": "Carlos Silva",
    "bio": "Especialista em cortes modernos e degradê.",
    "is_available": true
  }
]

```

### POST /barbers

Cadastra um novo barbeiro (Acesso restrito: admin).

### GET /barbers/:id/schedule

Retorna os horários disponíveis e ocupados de um barbeiro para uma data específica.

**Query Params:**

* `date` (Obrigatório: YYYY-MM-DD)

**Response:** `200 OK`

```json
{
  "barber_id": 2,
  "date": "2026-09-20",
  "available_slots": ["09:00", "10:00", "14:30", "16:00"],
  "booked_slots": ["11:00", "15:00"]
}

```

---

## 💰 Financeiro

### GET /financial/summary

Traz o resumo financeiro (faturamento, comissões) em um determinado período.

**Query Params:**

* `period` (ex: 2026-09)

**Response:** `200 OK`

```json
{
  "period": "2026-09",
  "total_revenue": 5420.00,
  "total_commissions": 2710.00,
  "appointments_count": 120
}

```

### GET /financial/barber/:id

Relatório financeiro filtrado especificamente pelas transações de um barbeiro.

---

## 🔔 Notificações

### POST /notifications/send

Envia uma notificação manual ou acionada pelo sistema (e-mail/WhatsApp).

**Body:**

```json
{
  "user_id": 1,
  "type": "appointment_reminder",
  "channel": "email", // "email" ou "whatsapp"
  "message": "Seu agendamento é amanhã às 14:30"
}

```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Notificação processada com sucesso."
}

```

---

## 📊 Dashboard

### GET /dashboard/stats

Retorna as estatísticas gerais formatadas para exibição rápida no painel administrativo.

**Response:** `200 OK`

```json
{
  "today_appointments": 8,
  "pending_appointments": 3,
  "monthly_revenue": 5420.00,
  "active_clients": 145,
  "top_barber": {
    "id": 2,
    "name": "Carlos Silva",
    "appointments_count": 45
  }
}

```