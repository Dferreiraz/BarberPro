# 🗄️ Database Schema - BarberPro

## PostgreSQL (Neon/Supabase)

---

## Tabelas Principais

### 1. users
Armazena todos os usuários do sistema (clientes, barbeiros, admin).

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client', -- 'client', 'barber', 'admin'
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

```

---

### 2. services

Catálogo de serviços oferecidos pela barbearia.

```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL, -- Duração em minutos
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de dados:
-- (1, 'Corte Degradê', 'Corte moderno com degradê', 45.00, 30, true)
-- (2, 'Barba Completa', 'Barba desenhada e hidratada', 35.00, 25, true)
-- (3, 'Corte + Barba', 'Combo completo', 70.00, 50, true)

```

---

### 3. barbers

Informações específicas dos barbeiros (relação 1:1 com users).

```sql
CREATE TABLE barbers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    commission_rate DECIMAL(5, 2) DEFAULT 50.00, -- Porcentagem de comissão
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_barbers_user_id ON barbers(user_id);

```

---

### 4. barber_services

Relação N:N entre barbeiros e serviços (quais serviços cada barbeiro oferece).

```sql
CREATE TABLE barber_services (
    id SERIAL PRIMARY KEY,
    barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE(barber_id, service_id) -- Evita duplicatas
);

CREATE INDEX idx_barber_services_barber ON barber_services(barber_id);
CREATE INDEX idx_barber_services_service ON barber_services(service_id);

```

---

### 5. appointments

Agendamentos (tabela principal do sistema).

```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_payment', -- 'pending_payment', 'confirmed', 'completed', 'cancelled'
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method TEXT, -- Preenchido após confirmação no WhatsApp ('pix', 'cash', 'credit', 'debit')
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(barber_id, date, time)
);

CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_barber ON appointments(barber_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

```

---

### 6. financial_transactions

Registro de transações financeiras (pagamentos, comissões).

```sql
CREATE TABLE financial_transactions (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    barber_id INTEGER NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT, -- 'cash', 'credit', 'debit', 'pix'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_financial_barber ON financial_transactions(barber_id);
CREATE INDEX idx_financial_status ON financial_transactions(status);

```

---

### 7. notifications

Histórico de notificações enviadas.

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'appointment_reminder', 'appointment_confirmed', 'appointment_cancelled'
    channel TEXT NOT NULL, -- 'email', 'whatsapp', 'sms'
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'sent' -- 'sent', 'delivered', 'failed'
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

```

---

## Relacionamentos

```text
users (1) ── (1) barbers
users (1) ── (N) appointments (como client)
barbers (1) ── (N) appointments
services (1) ── (N) appointments
barbers (N) ── (N) services (via barber_services)
appointments (1) ── (1) financial_transactions
users (1) ── (N) notifications

```

---

## Queries Comuns

### Horários disponíveis de um barbeiro

```sql
SELECT 
    generate_series(
        '09:00'::time, 
        '18:00'::time, 
        '30 minutes'::interval
    ) AS available_time
WHERE NOT EXISTS (
    SELECT 1 FROM appointments 
    WHERE barber_id = $1 
    AND date = $2 
    AND time = available_time
    AND status != 'cancelled'
);

```

### Faturamento mensal por barbeiro

```sql
SELECT 
    b.user_id,
    u.name AS barber_name,
    SUM(ft.amount) AS total_revenue,
    SUM(ft.commission_amount) AS total_commission,
    COUNT(ft.id) AS appointments_count
FROM financial_transactions ft
JOIN barbers b ON ft.barber_id = b.id
JOIN users u ON b.user_id = u.id
WHERE ft.status = 'paid'
AND ft.paid_at >= $1
AND ft.paid_at < $2
GROUP BY b.user_id, u.name;

```

### Próximos agendamentos do cliente

```sql
SELECT 
    a.*,
    s.name AS service_name,
    u.name AS barber_name
FROM appointments a
JOIN services s ON a.service_id = s.id
JOIN barbers b ON a.barber_id = b.id
JOIN users u ON b.user_id = u.id
WHERE a.client_id = $1
AND a.date >= CURRENT_DATE
AND a.status != 'cancelled'
ORDER BY a.date, a.time;

```

---

## Migrações

Usar sistema de migrações (futuro):

* `001_create_users.sql`
* `002_create_services.sql`
* `003_create_barbers.sql`
* `004_create_appointments.sql`
* `005_create_financial_transactions.sql`
* `006_create_notifications.sql`

```