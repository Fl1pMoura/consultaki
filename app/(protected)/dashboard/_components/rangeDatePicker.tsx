"use client";

import "dayjs/locale/pt-br";

import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { DateRange } from "react-day-picker";
dayjs.locale("pt-br");

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const RangeDatePicker = () => {
  const [from, setFrom] = useQueryState("from", parseAsIsoDate);
  const [to, setTo] = useQueryState("to", parseAsIsoDate);

  function handleSelect(range: DateRange) {
    setFrom(range?.from ? dayjs(range.from).toDate() : null, {
      shallow: false,
    });
    setTo(range?.to ? dayjs(range.to).toDate() : null, {
      shallow: false,
    });
  }

  return (
    <div className="w-full max-w-xs space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-full justify-between font-normal"
          >
            {from && to
              ? `${dayjs(from).format("DD [de] MMMM [de] YY")} - ${dayjs(to).format("DD [de] MMMM [de] YY")}`
              : "Selecione um período"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            locale={ptBR}
            required
            selected={{
              from: from ? dayjs(from).toDate() : undefined,
              to: to ? dayjs(to).toDate() : undefined,
            }}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
