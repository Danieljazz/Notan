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
  varchar,
  tinyint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey().notNull(),
  name: text("name"),
  surname: text("surname"),
  avatarUrl: text("avatar_url"),
  billingAddress: json("billing_address")
    .$type<{
      country: string | null;
      city: string | null;
      street: string | null;
      house: number | null;
    }>()
    .default({ country: null, city: null, street: null, house: null }),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  paymentMethod: json("payment_method")
    .$type<{
      type: "card" | "blik" | "subscription" | null;
    }>()
    .default({ type: null }),
  email: varchar("email", { length: 256 }).unique(),
  password: varchar("password", { length: 256 }).notNull(),
});

export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
  }).defaultNow(),
  workspaceOwner: int("workspace_owner")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  icon: text("icon"),
  inTrash: tinyint("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
});

export const folders = mysqlTable("folders", {
  id: int("id").autoincrement().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
  }).defaultNow(),
  title: text("title"),
  icon: text("icon"),
  inTrash: boolean("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  workspaceId: int("workspace_id")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
  }).defaultNow(),
  title: text("title"),
  icon: text("icon"),
  inTrash: boolean("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  workspaceId: int("workspace_id")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),
  folderId: int("folder_id")
    .references(() => folders.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey().notNull(),
  active: boolean("active"),
  name: text("name"),
  description: text("description"),
  image: text("image"),
  metadata: json("metadata"),
});

export const prices = mysqlTable("prices", {
  id: int("id").autoincrement().primaryKey().notNull(),
  productId: int("product_id").references(() => products.id),
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
  id: int("id").autoincrement().primaryKey().notNull(),
  userId: int("user_id").notNull(),
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
  priceId: int("price_id").references(() => prices.id),
  quantity: int("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  createdAt: timestamp("created", { mode: "string" }).notNull().defaultNow(),
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
