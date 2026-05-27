import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,

} from 'drizzle-orm/pg-core'
import { usersTable } from './user';

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 100 }).notNull(),
  discription:text(),
  createdby:uuid("createdby").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type Selectform= typeof formsTable.$inferSelect;
export type Insertform = typeof formsTable.$inferInsert;