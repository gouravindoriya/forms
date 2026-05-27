import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,

} from 'drizzle-orm/pg-core'
import { formsTable } from './form';


export const filedTypeEnum=pgEnum('field_type_enum',['TEXT','NUMBER','EMAIL','YES_NO','PASSWORD'])

export const formfieldsTable = pgTable("formfields", {
  id: uuid("id").primaryKey().defaultRandom(),

  label: varchar("label", { length: 100 }).notNull(),
  labelkey: varchar("label_key", { length: 120 }).notNull(),

  placeholder: text("placeholder"),
  isRequired: boolean("is_required").default(false).notNull(),

  formId: uuid("form_id").references(() => formsTable.id),
   
  index:numeric('index',{scale:2}),  // fractional indexing
   
  type:filedTypeEnum('type').notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
},(table)=>{
    return {
        uniqueFormAndIndex:unique().on(table.formId,table.index)
    }
});

export type SelectFormfield = typeof formfieldsTable.$inferSelect;
export type InsertFormfield = typeof formfieldsTable.$inferInsert;