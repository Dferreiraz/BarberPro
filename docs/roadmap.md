# 🗺️ Roadmap - BarberPro

## Visão Geral
Desenvolvimento em **4 fases** ao longo de **8 semanas**, do MVP ao produto completo.

---

## 🧱 Fase 1: Fundação 
**Objetivo:** Estrutura base, autenticação e CRUD principal.

### ⚙️ Backend
- [x] Configurar projeto Node.js + Express
- [x] Configurar PostgreSQL e criar schema
- [x] Implementar autenticação JWT (register/login)
- [x] CRUD de usuários (clientes e barbeiros)
- [x] CRUD de serviços
- [x] Middleware de autenticação e autorização

### 💻 Frontend
- [x] Configurar React + Vite + Tailwind CSS
- [x] Sistema de rotas (React Router)
- [x] Páginas de login e registro
- [x] Layout base (header, sidebar, footer)
- [x] Dark mode funcional

### 🧪 Testes
- [x] Testes unitários de autenticação
- [x] Testes manuais de integração

**Entregável:** Sistema de login funcional com CRUD básico.

---

## 📅 Fase 2: Agendamentos e WhatsApp
**Objetivo:** Core do negócio - sistema de agendamentos com fechamento via WhatsApp.

### ⚙️ Backend
- [x] CRUD de agendamentos (Create, Read, Update, Delete).
- [x] Lógica de validação de disponibilidade (evitar conflitos de horário).
- [x] Endpoint que retorna a URL de redirecionamento para o WhatsApp do barbeiro (`wa.me`) com mensagem pré-formatada.
- [x] Atualização de status do agendamento (`pending_payment` -> `confirmed` -> `completed`).

### 💻 Frontend
- [x] Calendário visual ou seletor de data/hora intuitivo.
- [x] Resumo do agendamento antes da confirmação.
- [x] Lógica de redirecionamento para o WhatsApp (`window.open(whatsapp_url, '_blank')`).
- [x] Dashboard de agendamentos para o barbeiro (com botão para marcar como "Pago/Confirmado").

### 🧪 Testes
- [x] Testes de validação de disponibilidade
- [x] Testes de conflitos de horário

**Entregável:** Sistema completo de agendamentos funcional.

---

## 💰 Fase 3: Financeiro Simplificado e Notificações
**Objetivo:** Controle de caixa e lembretes, sem gateway de pagamento complexo.

### ⚙️ Backend
- [ ] Relatórios de faturamento baseados nos agendamentos com status `completed` ou `confirmed`.
- [ ] Cálculo automático de comissões com base no `total_price` e `commission_rate` do barbeiro.
- [ ] Sistema de lembretes automáticos por e-mail (24h antes do agendamento).

### 💻 Frontend
- [ ] Dashboard financeiro (gráficos de faturamento diário/mensal).
- [ ] Tela de fechamento de caixa diário.
- [ ] Configurações de perfil do barbeiro (incluir campo para número do WhatsApp).

### 🧪 Testes
- [ ] Testes de cálculo de comissões
- [ ] Testes de envio de e-mail (mock)

**Entregável:** Sistema financeiro completo com notificações automáticas.

---

## 🚀 Fase 4: Polimento e Deploy 
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