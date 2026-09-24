# 🎯 Technical Decisions - BarberPro

## Registro de Decisões Arquiteturais (ADR)

---

## ADR-001: Escolha do Banco de Dados

### Status: Aceito ✅

### Contexto
Precisamos de um banco de dados relacional para gerenciar relacionamentos complexos entre clientes, barbeiros, serviços e agendamentos. O sistema requer transações ACID para garantir integridade financeira.

### Decisão
**PostgreSQL** via serviço cloud (Neon ou Supabase).

### Justificativa
- ✅ Suporte nativo a transações ACID (crítico para financeiro)
- ✅ Escalabilidade horizontal com connection pooling
- ✅ Plano gratuito generoso (Neon: 0.5GB, Supabase: 500MB)
- ✅ Compatibilidade com Docker e Render
- ✅ Experiência prévia no projeto DocTranscriber

### Alternativas Rejeitadas
- **MongoDB:** Schema flexível, mas falta de transações ACID nativas complica o módulo financeiro.
- **SQLite:** Simples, mas não suporta concorrência múltipla (problema em produção).
- **MySQL:** Boa opção, mas PostgreSQL tem melhor suporte a JSON e índices parciais.

---

## ADR-002: Autenticação JWT vs Session

### Status: Aceito ✅

### Decisão
**JWT (JSON Web Tokens)** com refresh token.

### Justificativa
- ✅ Stateless: facilita escalabilidade horizontal
- ✅ Compatível com APIs RESTful
- ✅ Funciona bem com React (armazenamento em localStorage/httpOnly cookie)
- ✅ Refresh token permite renovação silenciosa

### Implementação
- Access token: 15 minutos de expiração
- Refresh token: 7 dias de expiração
- Armazenamento: httpOnly cookie (mais seguro que localStorage)

---

## ADR-003: Gerenciamento de Estado no Frontend

### Status: Aceito ✅

### Decisão
**Zustand** para estado global + **React Query** para cache de servidor.

### Justificativa
- ✅ Zustand: Leve (1KB), simples, sem boilerplate (vs Redux)
- ✅ React Query: Cache automático, refetch inteligente, otimista updates
- ✅ Separação clara: estado de UI (Zustand) vs estado de servidor (React Query)

### Alternativas Rejeitadas
- **Redux Toolkit:** Boilerplate excessivo para projeto médio.
- **Context API:** Performance ruim com updates frequentes.

---

## ADR-004: Validação de Dados

### Status: Aceito ✅

### Decisão
**Zod** para validação no backend e frontend.

### Justificativa
- ✅ Schema único compartilhável entre frontend e backend
- ✅ TypeScript-first (inferência de tipos automática)
- ✅ Mensagens de erro customizáveis
- ✅ Validação de formulários com React Hook Form + Zod

### Exemplo
```javascript
const appointmentSchema = z.object({
  client_id: z.number().positive(),
  barber_id: z.number().positive(),
  service_id: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

```

---

## ADR-005: Fluxo de Pagamento e Comunicação (WhatsApp First)

### Status: Aceito ✅

### Contexto
Integrar gateways de pagamento (Stripe, Mercado Pago) adiciona complexidade, taxas e fricção para o MVP. O público-alvo (clientes de barbearia) já está habituado a combinar pagamentos via WhatsApp.

### Decisão
O fluxo de agendamento será finalizado com um redirecionamento do Front-end para a API do WhatsApp (`wa.me`), com uma mensagem pré-preenchida contendo os dados do agendamento. O fechamento do pagamento e a confirmação final serão feitos via conversa no WhatsApp, e o status será atualizado manualmente pelo barbeiro no painel administrativo.

### Justificativa
- ✅ Zero custo de integração de pagamento no MVP.
- ✅ Experiência mais humana e personalizada para o cliente.
- ✅ Reduz drasticamente a taxa de abandono no checkout.
- ✅ O backend apenas precisa gerar a URL do `wa.me` com o número do barbeiro e os dados do agendamento.

### Implementação
1. Cliente finaliza a seleção no Front-end.
2. Backend cria o agendamento com status `pending_payment`.
3. Backend retorna a URL: `https://wa.me/{barber_phone}?text={encoded_message}`.
4. Front-end redireciona o usuário para essa URL.
5. Barbeiro confirma o recebimento e atualiza o status para `confirmed` no painel.
---

## ADR-006: Deploy e Infraestrutura

### Status: Aceito ✅

### Decisão

**Render** para backend/frontend + **Neon** para PostgreSQL.

### Justificativa

* ✅ Render: Deploy automático via GitHub, plano gratuito (750h/mês)
* ✅ Neon: PostgreSQL serverless, plano gratuito (0.5GB), auto-pause
* ✅ Experiência validada no DocTranscriber
* ✅ Docker Compose para desenvolvimento local

### Alternativas Rejeitadas

* **Vercel:** Excelente para frontend, mas backend Node.js limitado.
* **Railway:** Boa opção, mas Render tem plano free mais generoso.
* **AWS/GCP:** Overkill para MVP, complexidade alta.

---

## ADR-007: Arquitetura de Pastas (Clean Architecture)

### Status: Aceito ✅

### Decisão

Separação em **Controllers → Services → Repositories**.

### Justificativa

* ✅ Controllers: Apenas lógica HTTP (req/res)
* ✅ Services: Regras de negócio (testáveis isoladamente)
* ✅ Repositories: Acesso ao banco (facilita troca de DB)
* ✅ Facilita testes unitários e de integração

### Exemplo

```javascript
// Controller (fino)
const createAppointment = async (req, res) => {
  const appointment = await appointmentService.create(req.body);
  res.status(201).json(appointment);
};

// Service (regras de negócio)
const create = async (data) => {
  await validateAvailability(data);
  return await appointmentRepo.create(data);
};

// Repository (banco)
const create = async (data) => {
  const { rows } = await pool.query('INSERT INTO appointments...', [...]);
  return rows[0];
};

```

---

## ADR-008: Testes Automatizados

### Status: Planejado 📋

### Decisão

**Jest** + **Supertest** para backend, **Vitest** + **React Testing Library** para frontend.

### Justificativa

* ✅ Jest: Padrão da indústria, boa documentação
* ✅ Supertest: Testa endpoints HTTP sem subir servidor
* ✅ Cobertura mínima: 70% para services e repositories

### Estratégia

* Testes unitários: Services e utils
* Testes de integração: Controllers + Database
* Testes E2E: Fluxos críticos (agendamento, pagamento)