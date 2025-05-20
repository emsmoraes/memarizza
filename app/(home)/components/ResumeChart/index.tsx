"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";

type ResumeData = {
  name: string;
  modules: number;
  sessions: number;
  questions: number;
};

interface ResumeChartProps {
  data: ResumeData[];
}

const chartConfig = {
  modules: {
    label: "Módulos",
    color: "hsl(var(--chart-1))",
  },
  sessions: {
    label: "Sessões",
    color: "hsl(var(--chart-2))",
  },
  questions: {
    label: "Questões",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

function ResumeChart({ data }: ResumeChartProps) {
  return (
    <div className="max-h-full flex-1 rounded-xl bg-muted/50 md:min-h-min">
      <div className="flex h-full w-full flex-col p-4">
        <h2 className="mb-6 text-center text-lg">Resumo mensal</h2>
        <div className="h-full w-full">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full min-h-[200px] w-full flex-1"
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{ value: "Mês", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "Quantidade",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="top" height={36} />
              {Object.entries(chartConfig).map(([key, { label, color }]) => (
                <Bar key={key} dataKey={key} name={label} fill={color} />
              ))}
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

export default ResumeChart;
