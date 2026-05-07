import { pgTable, varchar, timestamp, text, integer, jsonb, index, boolean, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 用户资料表 - 关联 Supabase Auth
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().default(sql`auth.uid()`),
    email: varchar("email", { length: 255 }),
    name: varchar("name", { length: 128 }),
    avatar_url: text("avatar_url"),
    is_subscribed: boolean("is_subscribed").default(false),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("profiles_email_idx").on(table.email),
  ]
);

// 用户自选代币表
export const watchlist = pgTable(
  "watchlist",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    user_id: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    contract_address: varchar("contract_address", { length: 256 }).notNull(),
    chain: varchar("chain", { length: 50 }).notNull(),
    symbol: varchar("symbol", { length: 20 }).notNull(),
    name: varchar("name", { length: 128 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("watchlist_user_id_idx").on(table.user_id),
    index("watchlist_contract_idx").on(table.contract_address),
  ]
);

// AI 扫描历史表
export const scanHistory = pgTable(
  "scan_history",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    user_id: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
    contract_address: varchar("contract_address", { length: 256 }).notNull(),
    chain: varchar("chain", { length: 50 }).notNull(),
    symbol: varchar("symbol", { length: 20 }),
    name: varchar("name", { length: 128 }),
    // 六维评分
    narrative_score: integer("narrative_score"),
    community_score: integer("community_score"),
    holder_score: integer("holder_score"),
    liquidity_score: integer("liquidity_score"),
    catalyst_score: integer("catalyst_score"),
    security_score: integer("security_score"),
    total_score: integer("total_score"),
    // AI 分析结果
    analysis_result: jsonb("analysis_result"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("scan_history_user_id_idx").on(table.user_id),
    index("scan_history_contract_idx").on(table.contract_address),
    index("scan_history_created_at_idx").on(table.created_at),
  ]
);

// 热门代币缓存表
export const trendingTokens = pgTable(
  "trending_tokens",
  {
    id: varchar("id", { length: 100 }).primaryKey(), // CoinGecko ID
    symbol: varchar("symbol", { length: 20 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    chain: varchar("chain", { length: 50 }),
    rank: integer("rank"),
    price: varchar("price", { length: 50 }),
    price_change_24h: varchar("price_change_24h", { length: 50 }),
    volume_24h: varchar("volume_24h", { length: 50 }),
    market_cap: varchar("market_cap", { length: 50 }),
    holders: varchar("holders", { length: 50 }),
    ai_score: integer("ai_score"),
    ai_trend: varchar("ai_trend", { length: 20 }),
    signal: varchar("signal", { length: 20 }),
    tags: jsonb("tags"),
    last_updated: timestamp("last_updated", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("trending_tokens_rank_idx").on(table.rank),
    index("trending_tokens_ai_score_idx").on(table.ai_score),
    index("trending_tokens_updated_idx").on(table.last_updated),
  ]
);

// 候补名单表
export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    source: varchar("source", { length: 50 }).default("website"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("waitlist_email_idx").on(table.email),
    index("waitlist_created_idx").on(table.created_at),
  ]
);

// 健康检查表
export const healthCheck = pgTable("health_check", {
  id: integer("id").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
