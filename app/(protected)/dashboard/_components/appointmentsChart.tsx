"use client";

import dayjs from "dayjs";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AppointmentsChartProps {
  chartData: {
    date: Date;
    count: number;
  }[];
}

export function AppointmentsChart({ chartData }: AppointmentsChartProps) {
  const chartConfig = {
    count: {
      label: "Agendamentos",
      color: "var(--chart-1)",
    },
    date: {
      label: "Data",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  console.log(chartData);
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[210px] min-h-[210px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => dayjs(value).format("DD/MM")}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className="w-[180px]"
              formatter={(_, name, item) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                    style={
                      {
                        "--color-bg": `var(--color-${name})`,
                      } as React.CSSProperties
                    }
                  />
                  <div className="text-foreground block items-center gap-2 font-medium">
                    {dayjs(item.payload.date).format("DD/MM")}
                  </div>
                  <span className="text-foreground flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                    {item.payload.count}
                    <span className="text-muted-foreground font-normal">
                      {item.payload.count === 1
                        ? "agendamento"
                        : "agendamentos"}
                    </span>
                  </span>
                </>
              )}
            />
          }
          cursor={false}
        />
        <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
