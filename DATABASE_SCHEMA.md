# 📊 Budget Buddy - Database Schema

## Overview

This document describes the PostgreSQL schema for Budget Buddy's future database integration.

## Tables

### users
Stores user account information.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture_url VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'ILS',
  timezone VARCHAR(50) DEFAULT 'Asia/Jerusalem',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### expenses
Stores individual expense records.

```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ILS',
  category VARCHAR(50) NOT NULL,
  description TEXT,
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  receipt_url VARCHAR(255),
  tags TEXT[],
  source VARCHAR(50), -- 'manual', 'voice', 'integration', 'api'
  nlp_confidence FLOAT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern VARCHAR(50) -- 'daily', 'weekly', 'monthly', 'yearly'
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
```

### categories
User-defined and system categories.

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  color VARCHAR(7), -- Hex color
  budget_limit DECIMAL(10, 2),
  budget_period VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'yearly'
  is_active BOOLEAN DEFAULT TRUE,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE UNIQUE INDEX idx_categories_user_name ON categories(user_id, name);
```

### budgets
Monthly/custom period budgets.

```sql
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  description TEXT,
  alerts_enabled BOOLEAN DEFAULT TRUE,
  alert_threshold FLOAT DEFAULT 0.75, -- Alert at 75%
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_period ON budgets(period_start, period_end);
```

### savings_goals
Savings targets and goals.

```sql
CREATE TABLE savings_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  deadline DATE,
  priority VARCHAR(20), -- 'high', 'medium', 'low'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
```

### recurring_expenses
Recurring expense templates.

```sql
CREATE TABLE recurring_expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  frequency VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recurring_expenses_user_id ON recurring_expenses(user_id);
```

### integrations
Connected third-party integrations.

```sql
CREATE TABLE integrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL, -- 'bank', 'paypal', 'stripe', etc
  external_id VARCHAR(255),
  access_token VARCHAR(1000),
  refresh_token VARCHAR(1000),
  token_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP,
  sync_interval INTEGER, -- seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE UNIQUE INDEX idx_integrations_user_type ON integrations(user_id, integration_type);
```

### integration_logs
Log integration sync activities.

```sql
CREATE TABLE integration_logs (
  id SERIAL PRIMARY KEY,
  integration_id INTEGER NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  status VARCHAR(20), -- 'success', 'failed', 'partial'
  records_synced INTEGER,
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integration_logs_integration_id ON integration_logs(integration_id);
```

### spending_analytics
Pre-calculated analytics for performance.

```sql
CREATE TABLE spending_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_date DATE NOT NULL,
  total_spent DECIMAL(10, 2),
  average_daily DECIMAL(10, 2),
  category_breakdown JSONB, -- {'category': amount, ...}
  trends JSONB, -- {'trend_name': value}
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_spending_analytics_user_id ON spending_analytics(user_id);
CREATE INDEX idx_spending_analytics_period ON spending_analytics(period_date);
```

### user_preferences
User settings and preferences.

```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'dark', -- 'light', 'dark', 'auto'
  language VARCHAR(10) DEFAULT 'he',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT FALSE,
  weekly_summary BOOLEAN DEFAULT TRUE,
  budget_alerts BOOLEAN DEFAULT TRUE,
  privacy_mode BOOLEAN DEFAULT FALSE,
  export_on_delete BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### audit_log
Track user actions for security.

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

---

## Relationships

```
users (1) ──── (N) expenses
users (1) ──── (N) categories
users (1) ──── (N) budgets
users (1) ──── (N) savings_goals
users (1) ──── (N) recurring_expenses
users (1) ──── (N) integrations
users (1) ──── (1) user_preferences

categories (1) ──── (N) budgets
integrations (1) ──── (N) integration_logs
```

---

## Key Features

### Performance Optimizations
- **Indexed Columns**: Frequently queried fields (user_id, date, category)
- **Composite Indexes**: user_id + date for range queries
- **JSON Fields**: Flexible storage for analytics data

### Data Integrity
- **Foreign Keys**: Referential integrity with CASCADE delete
- **Unique Constraints**: Email, user+category combinations
- **Soft Deletes**: deleted_at field for data recovery

### Audit & Security
- **audit_log Table**: Track all user actions
- **token_expires_at**: Secure integration token management
- **Encrypted Credentials**: Handle sensitive data securely

### Flexibility
- **JSONB Fields**: Store flexible analytics and metadata
- **Tags Array**: Support multiple tags per expense
- **Custom Categories**: User-defined spending categories

---

## Migration Strategy

### Phase 1: Core Tables
1. users
2. categories
3. expenses
4. user_preferences

### Phase 2: Advanced Features
1. budgets
2. recurring_expenses
3. savings_goals
4. spending_analytics

### Phase 3: Integrations
1. integrations
2. integration_logs

### Phase 4: Security
1. audit_log
2. Enhanced encryption

---

## Example Queries

### Monthly Spending Summary
```sql
SELECT
  DATE_TRUNC('month', date) as month,
  category,
  SUM(amount) as total,
  COUNT(*) as count,
  AVG(amount) as average
FROM expenses
WHERE user_id = $1
  AND date >= DATE_TRUNC('month', NOW()) - INTERVAL '1 year'
GROUP BY DATE_TRUNC('month', date), category
ORDER BY month DESC, total DESC;
```

### Budget Status
```sql
SELECT
  c.name,
  c.budget_limit,
  COALESCE(SUM(e.amount), 0) as spent,
  ROUND((COALESCE(SUM(e.amount), 0) / c.budget_limit * 100)::numeric, 2) as percentage,
  CASE
    WHEN COALESCE(SUM(e.amount), 0) >= c.budget_limit THEN 'exceeded'
    WHEN COALESCE(SUM(e.amount), 0) >= c.budget_limit * 0.9 THEN 'warning'
    ELSE 'ok'
  END as status
FROM categories c
LEFT JOIN expenses e ON e.category = c.name
  AND e.user_id = $1
  AND e.date >= DATE_TRUNC('month', NOW())
WHERE c.user_id = $1
  AND c.budget_limit IS NOT NULL
GROUP BY c.id, c.name, c.budget_limit;
```

### Recurring Pattern Detection
```sql
SELECT
  description,
  category,
  COUNT(*) as frequency,
  AVG(amount) as avg_amount,
  STDDEV(amount) as variance,
  DATE_PART('day', MAX(date) - MIN(date)) / (COUNT(*) - 1) as avg_days_between
FROM expenses
WHERE user_id = $1
  AND date >= NOW() - INTERVAL '3 months'
GROUP BY description, category
HAVING COUNT(*) >= 3
ORDER BY frequency DESC;
```

---

## Notes

- All timestamps are in UTC
- Currency is ISO 4217 (default: ILS for Israeli Shekel)
- Soft deletes via `deleted_at` allow data recovery
- JSONB fields support complex queries and indexing
- Regular backups recommended for financial data
- Encryption at rest recommended for sensitive fields

---

**Last Updated**: 2026-09-17  
**Version**: 1.0.0  
**Status**: Ready for Implementation
