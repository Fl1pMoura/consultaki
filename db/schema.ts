import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
// Users

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
// Users to Clinics
export const usersTableRelation = relations(usersTable, ({ many }) => ({
  clinics: many(usersToClinicsTable),
}));

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
// Clinics
export const clinicsTable = pgTable("clinics", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
// Clinics to Users
export const clinicsTableRelation = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  users: many(usersToClinicsTable),
}));
// Users to Clinics Relations MANY TO MANY
export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
// Users to Clinics Relations MANY TO MANY Relations
export const usersToClinicsTableRelation = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);
// Doctors
export const doctorsTable = pgTable("doctors", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  imageUrl: text("image_url"),
  speciality: text().notNull(),
  // 0 - Domingo, 1 - Segunda, 2 - Terça, 3 - Quarta, 4 - Quinta, 5s - Sexta, 6 - Sábado
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  // Formato: HH:MM:SS
  availableFromHour: time("available_from_hour"),
  availableToHour: time("available_to_hour"),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
// Doctors Relations
export const doctorsTableRelation = relations(
  doctorsTable,
  ({ many, one }) => ({
    appointments: many(appointmentsTable),
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);
// Patients
export const patientsTable = pgTable("patients", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  sex: patientSexEnum("sex").notNull(),
  birthDate: timestamp("birth_date"),
  document: text("document").notNull().unique(),
  agreement: text("agreement"),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
// Patients Relations
export const patientsTableRelation = relations(
  patientsTable,
  ({ many, one }) => ({
    appointments: many(appointmentsTable),
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);
// Appointments
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "cancelled",
]);
export const appointmentsTable = pgTable("appointments", {
  id: uuid().primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patientsTable.id, {
    onDelete: "cascade",
  }),
  doctorId: uuid("doctor_id").references(() => doctorsTable.id, {
    onDelete: "cascade",
  }),
  clinicId: uuid("clinic_id").references(() => clinicsTable.id, {
    onDelete: "cascade",
  }),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
// Appointments Relations
export const appointmentsTableRelation = relations(
  appointmentsTable,
  ({ one }) => ({
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);
