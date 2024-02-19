import {
  mysqlTable,
  mysqlEnum,
  primaryKey,
  text,
  timestamp,
  boolean,
  json,
  bigint,
  int,
} from "drizzle-orm/mysql-core";

import { sql } from "drizzle-orm";
export const keyStatus = mysqlEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = mysqlEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const factorType = mysqlEnum("factor_type", ["webauthn", "totp"]);
export const factorStatus = mysqlEnum("factor_status", [
  "verified",
  "unverified",
]);
export const aalLevel = mysqlEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = mysqlEnum("code_challenge_method", [
  "plain",
  "s256",
]);
export const pricingType = mysqlEnum("pricing_type", ["recurring", "one_time"]);
export const pricingPlanInterval = mysqlEnum("pricing_plan_interval", [
  "year",
  "month",
  "week",
  "day",
]);
export const subscriptionStatus = mysqlEnum("subscription_status", [
  "unpaid",
  "past_due",
  "incomplete_expired",
  "incomplete",
  "canceled",
  "active",
  "trialing",
]);

export const workspaces = mysqlTable("workspaces", {
  id: text("id")
    .default(sql`(uuid())`)
    .notNull()
    .primaryKey(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  workspaceOwner: text("workspace_owner")
    .default(sql`(uuid())`)
    .notNull(),
  title: text("title"),
  icon: text("icon"),
  inTrash: boolean("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
});

export const folders = mysqlTable("folders", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  title: text("title"),
  icon: text("icon"),
  inTrash: boolean("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  workspaceId: text("workspace_owner")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
});

export const files = mysqlTable("files", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  title: text("title"),
  icon: text("icon"),
  inTrash: boolean("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  workspaceId: text("workspace_id")
    .default(sql`(uuid())`)
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  folderId: text("folder_id")
    .default(sql`(uuid())`)
    .notNull()
    .references(() => folders.id, { onDelete: "cascade" }),
});

export const users = mysqlTable("users", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey()
    .notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  billingAddress: json("billing_address"),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  paymentMethod: json("payment_method"),
  email: text("email"),
});

export const customers = mysqlTable("customers", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey()
    .notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});

export const products = mysqlTable("products", {
  id: text("id").primaryKey().notNull(),
  active: boolean("active"),
  name: text("name"),
  description: text("description"),
  image: text("image"),
  metadata: json("metadata"),
});

export const prices = mysqlTable("prices", {
  id: text("id").primaryKey().notNull(),
  productId: text("product_id").references(() => products.id),
  active: boolean("active"),
  description: text("description"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  unitAmount: bigint("unit_amount", { mode: "number" }),
  currency: text("currency"),
  type: mysqlEnum("pricing_type", ["recurring", "one_time"]),
  interval: mysqlEnum("pricing_plan_interval", [
    "year",
    "month",
    "week",
    "day",
  ]),
  intervalCount: int("interval_count"),
  trialPeriodDays: int("trial_period_days"),
  metadata: json("metadata"),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  status: mysqlEnum("subscription_status", [
    "unpaid",
    "past_due",
    "incomplete_expired",
    "incomplete",
    "canceled",
    "active",
    "trialing",
  ]),
  metadata: json("metadata"),
  priceId: text("price_id").references(() => prices.id),
  quantity: int("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  created: timestamp("created", { mode: "string" }).notNull().defaultNow(),
  currentPeriodStart: timestamp("current_period_start", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  currentPeriodEnd: timestamp("current_period_end", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", {
    mode: "string",
  }).defaultNow(),
  cancelAt: timestamp("cancel_at", {
    mode: "string",
  }).defaultNow(),
  canceledAt: timestamp("canceled_at", {
    mode: "string",
  }).defaultNow(),
  trialStart: timestamp("trial_start", {
    mode: "string",
  }).defaultNow(),
  trialEnd: timestamp("trial_end", {
    mode: "string",
  }).defaultNow(),
});
