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
