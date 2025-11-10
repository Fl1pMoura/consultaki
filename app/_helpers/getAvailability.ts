import dayjs from "dayjs";
import locale from "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";

import { doctorsTable } from "@/db/schema";

dayjs.extend(utc);
dayjs.locale(locale);

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const from = dayjs()
    .utc()
    .day(doctor.availableFromWeekDay)
    .set("hour", Number(doctor.availableFromHour?.split(":")[0]))
    .set("minute", Number(doctor.availableFromHour?.split(":")[1]))
    .set("second", Number(doctor.availableFromHour?.split(":")[2] ?? 0))
    .local();

  const to = dayjs()
    .utc()
    .day(doctor.availableToWeekDay)
    .set("hour", Number(doctor.availableToHour?.split(":")[0]))
    .set("minute", Number(doctor.availableToHour?.split(":")[1]))
    .set("second", Number(doctor.availableToHour?.split(":")[2] ?? 0))
    .local();

  return { from, to };
};

export const generateTimeSlots = (interval: number = 30) => {
  if (interval !== 30 && interval !== 60) {
    throw new Error("Interval must be 30 or 60");
  }
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += interval) {
      timeSlots.push(
        `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}:00`,
      );
    }
  }
  return timeSlots;
};
