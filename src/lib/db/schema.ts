import { pgTable, text, timestamp, integer, decimal, boolean, jsonb, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const propfirmAccounts = pgTable('propfirm_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  propfirmName: varchar('propfirm_name', { length: 255 }).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(), // MT4, MT5, cTrader, etc.
  accountNumber: varchar('account_number', { length: 255 }).notNull(),
  server: varchar('server', { length: 255 }),
  balance: decimal('balance', { precision: 15, scale: 2 }).default('0'),
  equity: decimal('equity', { precision: 15, scale: 2 }).default('0'),
  apiCredentials: jsonb('api_credentials'), // Encrypted API keys/tokens
  isMaster: boolean('is_master').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const trades = pgTable('trades', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  accountId: uuid('account_id').references(() => propfirmAccounts.id, { onDelete: 'cascade' }),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  type: varchar('type', { length: 10 }).notNull(), // BUY, SELL
  lotSize: decimal('lot_size', { precision: 10, scale: 2 }).notNull(),
  openPrice: decimal('open_price', { precision: 15, scale: 5 }).notNull(),
  closePrice: decimal('close_price', { precision: 15, scale: 5 }),
  stopLoss: decimal('stop_loss', { precision: 15, scale: 5 }),
  takeProfit: decimal('take_profit', { precision: 15, scale: 5 }),
  profit: decimal('profit', { precision: 15, scale: 2 }),
  commission: decimal('commission', { precision: 15, scale: 2 }),
  swap: decimal('swap', { precision: 15, scale: 2 }),
  openTime: timestamp('open_time').notNull(),
  closeTime: timestamp('close_time'),
  status: varchar('status', { length: 20 }).default('OPEN'), // OPEN, CLOSED, PENDING
  notes: text('notes'),
  screenshot: text('screenshot'),
  riskPercentage: decimal('risk_percentage', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const riskSettings = pgTable('risk_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  maxRiskPerTrade: decimal('max_risk_per_trade', { precision: 5, scale: 2 }).default('2'),
  maxTradesPerDay: integer('max_trades_per_day').default(5),
  maxDailyLoss: decimal('max_daily_loss', { precision: 5, scale: 2 }).default('5'),
  isLocked: boolean('is_locked').default(false),
  emergencyContact: varchar('emergency_contact', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const propfirmWhitelist = pgTable('propfirm_whitelist', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  allowsCopyTrading: boolean('allows_copy_trading').default(true),
  platforms: jsonb('platforms'), // Array of supported platforms
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const copyTradingGroups = pgTable('copy_trading_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  masterAccountId: uuid('master_account_id').references(() => propfirmAccounts.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const copyTradingSlaves = pgTable('copy_trading_slaves', {
  id: uuid('id').defaultRandom().primaryKey(),
  groupId: uuid('group_id').references(() => copyTradingGroups.id, { onDelete: 'cascade' }),
  accountId: uuid('account_id').references(() => propfirmAccounts.id, { onDelete: 'cascade' }),
  multiplier: decimal('multiplier', { precision: 5, scale: 2 }).default('1'),
  isActive: boolean('is_active').default(true),
})
