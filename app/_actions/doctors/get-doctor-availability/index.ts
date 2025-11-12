"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

import { generateTimeSlots } from "@/app/_helpers/getAvailability";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

dayjs.extend(utc);

export const getDoctorAvailability = actionClient
  .inputSchema(
    z.object({
      doctorId: z.string(),
      selectedDate: z.string(),
    }),
  )
  .action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinicId) {
      throw new Error("Clínica não encontrada");
    }
    const doctor = await db.query.doctorsTable.findFirst({
      where: and(
        eq(doctorsTable.id, data.doctorId),
        eq(doctorsTable.clinicId, session.user.clinicId),
      ),
      with: {
        appointments: true,
      },
    });
    if (!doctor) {
      throw new Error("Médico não encontrado");
    }
    const selectedDayOfWeek = dayjs(data.selectedDate).day();
    const doctorIsAvailable =
      doctor.availableFromWeekDay <= selectedDayOfWeek &&
      doctor.availableToWeekDay >= selectedDayOfWeek;
    if (!doctorIsAvailable) {
      return [];
    }
    const appointmentsOnSelectedDate = doctor.appointments
      .filter((appointment) => {
        return dayjs(appointment.appointmentDate).isSame(
          data.selectedDate,
          "day",
        );
      })
      .map((appointment) => {
        return dayjs(appointment.appointmentDate).utc().format("HH:mm:ss");
      });
    const timeSlots = generateTimeSlots(30);
    const doctorAvailableFrom = dayjs(data.selectedDate)
      .utc()
      .set("hour", Number(doctor.availableFromHour?.split(":")[0]))
      .set("minute", Number(doctor.availableFromHour?.split(":")[1]))
      .set("second", 0);
    const doctorAvailableTo = dayjs(data.selectedDate)
      .utc()
      .set("hour", Number(doctor.availableToHour?.split(":")[0]))
      .set("minute", Number(doctor.availableToHour?.split(":")[1]))
      .set("second", 0);
    const availableTimeSlots = timeSlots.filter((timeSlot) => {
      const date = dayjs(data.selectedDate)
        .utc()
        .set("hour", Number(timeSlot.split(":")[0]))
        .set("minute", Number(timeSlot.split(":")[1]))
        .set("second", 0);
      return (
        // verificar se a data é maior que a data de início do médico e menor que a data de término do médico
        (date.isAfter(doctorAvailableFrom) ||
          date.isSame(doctorAvailableFrom)) &&
        (date.isBefore(doctorAvailableTo) || date.isSame(doctorAvailableTo)) &&
        // verificar se não é uma data passada
        date.isAfter(dayjs().utc())
      );
    });
    return availableTimeSlots.map((timeSlot) => {
      // Converter o timeSlot de UTC para horário local
      const [hours, minutes, seconds] = timeSlot.split(":").map(Number);
      const localTimeSlot = dayjs(data.selectedDate)
        .utc()
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", seconds)
        .local()
        .format("HH:mm:ss");

      return {
        value: localTimeSlot,
        available: !appointmentsOnSelectedDate.includes(timeSlot),
      };
    });
  });
