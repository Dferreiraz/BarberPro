-- ============================================
-- BarberPro - Database Schema
-- PostgreSQL 
-- ============================================

-- ============================================
-- 1. USERS
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('client', 'barber', 'admin'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);


-- ============================================
-- 2. SERVICES
-- ============================================

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT services_price_check
        CHECK (price >= 0),

    CONSTRAINT services_duration_check
        CHECK (duration_minutes > 0)
);


-- ============================================
-- 3. BARBERS
-- ============================================

CREATE TABLE barbers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    commission_rate DECIMAL(5, 2) DEFAULT 50.00,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT barbers_commission_check
        CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

CREATE INDEX idx_barbers_user_id ON barbers(user_id);


-- ============================================
-- 4. BARBER SERVICES
-- ============================================

CREATE TABLE barber_services (
    id SERIAL PRIMARY KEY,
    barber_id INTEGER NOT NULL
        REFERENCES barbers(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL
        REFERENCES services(id) ON DELETE CASCADE,

    UNIQUE(barber_id, service_id)
);

CREATE INDEX idx_barber_services_barber
    ON barber_services(barber_id);

CREATE INDEX idx_barber_services_service
    ON barber_services(service_id);


-- ============================================
-- 5. APPOINTMENTS (Atualizado)
-- ============================================

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    barber_id INTEGER NOT NULL
        REFERENCES barbers(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL
        REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_payment',
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT appointments_status_check
        CHECK (
            status IN (
                'pending_payment',
                'confirmed',
                'completed',
                'cancelled'
            )
        ),

    CONSTRAINT appointments_payment_method_check
        CHECK (
            payment_method IS NULL OR
            payment_method IN (
                'cash',
                'credit',
                'debit',
                'pix'
            )
        ),

    CONSTRAINT appointments_price_check
        CHECK (total_price >= 0),

    UNIQUE(barber_id, date, time)
);

CREATE INDEX idx_appointments_client
    ON appointments(client_id);

CREATE INDEX idx_appointments_barber
    ON appointments(barber_id);

CREATE INDEX idx_appointments_date
    ON appointments(date);

CREATE INDEX idx_appointments_status
    ON appointments(status);


-- ============================================
-- 6. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    channel TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'sent',

    CONSTRAINT notifications_type_check
        CHECK (
            type IN (
                'appointment_reminder',
                'appointment_confirmed',
                'appointment_cancelled'
            )
        ),

    CONSTRAINT notifications_channel_check
        CHECK (
            channel IN (
                'email',
                'whatsapp',
                'sms'
            )
        ),

    CONSTRAINT notifications_status_check
        CHECK (
            status IN (
                'sent',
                'delivered',
                'failed'
            )
        )
);

CREATE INDEX idx_notifications_user
    ON notifications(user_id);