import { sql } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import type { Model, Prediction, Training } from "replicate";
import type { Stripe } from "stripe";

export const Users = pgTable(
	"users",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		image: text("image").notNull(),
		credits: integer("credits").notNull().default(5),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			emailIdx: index("users_email_idx").on(table.email),
			createdAtIdx: index("users_created_at_idx").on(table.createdAt.desc()),
			updatedAtIdx: index("users_updated_at_idx").on(table.updatedAt.desc()),
		};
	},
);

export const Images = pgTable(
	"images",
	{
		id: text("id").primaryKey().default(sql`gen_random_uuid()`),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		url: text("url").notNull(),
		caption: text("caption").default("").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			userIdIdx: index("images_user_id_idx").on(table.userId),
			createdAtIdx: index("images_created_at_idx").on(table.createdAt.desc()),
			updatedAtIdx: index("images_updated_at_idx").on(table.updatedAt.desc()),
		};
	},
);

export const Creations = pgTable(
	"creations",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		prompt: text("prompt").notNull(),
		url: text("url"),
		data: jsonb("data").$type<Prediction>().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			userIdIdx: index("creations_user_id_idx").on(table.userId),
			createdAtIdx: index("creations_created_at_idx").on(
				table.createdAt.desc(),
			),
			updatedAtIdx: index("creations_updated_at_idx").on(
				table.updatedAt.desc(),
			),
		};
	},
);

export const Checkouts = pgTable(
	"checkouts",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		// The webhook event, if it has been processed
		event: jsonb("event").$type<Stripe.CheckoutSessionCompletedEvent>(),
		// The Stripe checkout session object
		session: jsonb("session").$type<Stripe.Checkout.Session>().notNull(),
		// The Stripe price object
		price: jsonb("price").$type<Stripe.Price>().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			createdAtIdx: index("checkouts_created_at_idx").on(
				table.createdAt.desc(),
			),
			updatedAtIdx: index("checkouts_updated_at_idx").on(
				table.updatedAt.desc(),
			),
		};
	},
);

export const Trainings = pgTable(
	"trainings",
	{
		id: text("id").primaryKey().default(sql`gen_random_uuid()`),
		userId: text("user_id")
			.notNull()
			.references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }),
		zipUrl: text("zip_url").notNull(),
		model: jsonb("model").$type<Model>().notNull(),
		training: jsonb("training").$type<Training>().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
			.default(sql`now()`)
			.notNull()
			.$onUpdate(() => sql`now()`),
	},
	(table) => {
		return {
			userIdIdx: index("trainings_user_id_idx").on(table.userId),
			createdAtIdx: index("trainings_created_at_idx").on(
				table.createdAt.desc(),
			),
			updatedAtIdx: index("trainings_updated_at_idx").on(
				table.updatedAt.desc(),
			),
		};
	},
);

export type UserSelect = typeof Users.$inferSelect;
export type ImageSelect = typeof Images.$inferSelect;
export type CreationSelect = typeof Creations.$inferSelect;
export type CheckoutSelect = typeof Checkouts.$inferSelect;
export type TrainingSelect = typeof Trainings.$inferSelect;

export type UserInsert = typeof Users.$inferInsert;
export type ImageInsert = typeof Images.$inferInsert;
export type CreationInsert = typeof Creations.$inferInsert;
export type CheckoutInsert = typeof Checkouts.$inferInsert;
export type TrainingInsert = typeof Trainings.$inferInsert;

// Utility interfaces
export interface ImageWithCreation extends ImageSelect {
	creation: CreationSelect;
}
