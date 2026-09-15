# 🗺️ Roadmap - BarberPro

## Visão Geral
Desenvolvimento em **4 fases** ao longo de **8 semanas**, do MVP ao produto completo.

---

## 🧱 Fase 1: Fundação (Semana 1-2)
**Objetivo:** Estrutura base, autenticação e CRUD principal.

### ⚙️ Backend
- [ ] Configurar projeto Node.js + Express + TypeScript
- [ ] Configurar PostgreSQL (Neon) e criar schema
- [ ] Implementar autenticação JWT (register/login)
- [ ] CRUD de usuários (clientes e barbeiros)
- [ ] CRUD de serviços
- [ ] Middleware de autenticação e autorização

### 💻 Frontend
- [ ] Configurar React + Vite + Tailwind CSS
- [ ] Sistema de rotas (React Router)
- [ ] Páginas de login e registro
- [ ] Layout base (header, sidebar, footer)
- [ ] Dark mode funcional

### 🧪 Testes
- [ ] Testes unitários de autenticação
- [ ] Testes de integração de CRUD

**Entregável:** Sistema de login funcional com CRUD básico.

---

## 📅 Fase 2: Agendamentos (Semana 3-4)
**Objetivo:** Core do negócio - sistema de agendamentos.

### ⚙️ Backend
- [ ] CRUD de agendamentos
- [ ] Validação de disponibilidade (horários conflitantes)
- [ ] Endpoint de horários disponíveis por barbeiro/data
- [ ] Filtros e paginação de agendamentos
- [ ] Cancelamento e reagendamento

### 💻 Frontend
- [ ] Dashboard de agendamentos (calendário visual)
- [ ] Formulário de novo agendamento (seleção de serviço, barbeiro, data/hora)
- [ ] Lista de agendamentos com filtros (status, data, barbeiro)
- [ ] Modal de detalhes do agendamento
- [ ] Ações: confirmar, cancelar, reagendar

### 🧪 Testes
- [ ] Testes de validação de disponibilidade
- [ ] Testes de conflitos de horário

**Entregável:** Sistema completo de agendamentos funcional.

---

## 💰 Fase 3: Financeiro e Notificações (Semana 5-6)
**Objetivo:** Monetização e comunicação.

### ⚙️ Backend
- [ ] Registro de transações financeiras
- [ ] Cálculo automático de comissões
- [ ] Relatórios financeiros (diário, semanal, mensal)
- [ ] Sistema de notificações por e-mail (Nodemailer)
- [ ] Templates de e-mail (confirmação, lembrete, cancelamento)
- [ ] Agendamento de lembretes (cron job ou queue)

### 💻 Frontend
- [ ] Dashboard financeiro (gráficos de faturamento)
- [ ] Relatório por barbeiro (comissões)
- [ ] Tela de fechamento de caixa
- [ ] Configurações de notificações
- [ ] Histórico de notificações enviadas

### 🧪 Testes
- [ ] Testes de cálculo de comissões
- [ ] Testes de envio de e-mail (mock)

**Entregável:** Sistema financeiro completo com notificações automáticas.

---

## 🚀 Fase 4: Polimento e Deploy (Semana 7-8)
**Objetivo:** Produção, performance e experiência do usuário.

### ⚙️ Backend
- [ ] Otimização de queries (índices, explain analyze)
- [ ] Rate limiting em endpoints críticos
- [ ] Logging estruturado (Winston)
- [ ] Tratamento robusto de erros
- [ ] Documentação da API (Swagger/OpenAPI)

### 💻 Frontend
- [ ] Animações e transições suaves
- [ ] Loading states e skeleton screens
- [ ] Validação de formulários em tempo real
- [ ] Responsividade mobile completa
- [ ] PWA (Progressive Web App) - opcional

### 🚀 Deploy
- [ ] Configurar Render (backend + frontend)
- [ ] Configurar variáveis de ambiente em produção
- [ ] Testes de carga básicos
- [ ] Monitoramento (logs, uptime)

### 📄 Documentação
- [ ] README completo
- [ ] Guia de contribuição
- [ ] Documentação de API pública

**Entregável:** Produto em produção, pronto para uso real.

---

## 🎨 Funcionalidades Futuras (Pós-MVP)

### 🌟 Fase 5: Avançado
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp (Twilio)
- [ ] Sistema de fidelidade (pontos, descontos)
- [ ] Galeria de fotos (antes/depois)
- [ ] Avaliações e reviews de clientes
- [ ] Múltiplas unidades (franquias)

### 🤖 Fase 6: IA e Automação
- [ ] Recomendação de horários baseada em histórico
- [ ] Previsão de faturamento
- [ ] Chatbot para agendamento automático
- [ ] Análise de sentimentos em reviews

---

## 📊 Métricas de Sucesso

### Técnicas
- ✅ Cobertura de testes: > 70%
- ✅ Tempo de resposta API: < 200ms (p95)
- ✅ Uptime: > 99%

### Negócio
- ✅ Tempo para criar agendamento: < 30 segundos
- ✅ Taxa de no-show reduzida em 50% (com lembretes)
- ✅ Satisfação do usuário (NPS): > 8

---

## ✅ Critérios de Pronto (Definition of Done)

Para cada funcionalidade ser considerada "pronta":
- [ ] Código revisado (self-review + peer review)
- [ ] Testes automatizados passando
- [ ] Documentação atualizada (se aplicável)
- [ ] Deploy em staging testado
- [ ] Sem erros no console (frontend e backend)
- [ ] Responsivo em mobile e desktop
- [ ] Acessibilidade básica (ARIA labels, contraste)