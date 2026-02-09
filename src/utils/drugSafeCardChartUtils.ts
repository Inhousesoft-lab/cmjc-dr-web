import type { ChartOptions } from "chart.js";

type BuildBarChartDataArgs = {
  labels: string[];
  data1: number[];
  data2: number[];
  label1: string;
  label2: string;
};

export const verticalBarChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 5 },
      grid: { color: "#e7e7e7" },
    },
  },
};

export const buildVerticalBarChartData = ({
  labels,
  data1,
  data2,
  label1,
  label2,
}: BuildBarChartDataArgs) => ({
  labels,
  datasets: [
    {
      label: label1,
      data: data1,
      backgroundColor: "#0a7a7e",
      borderRadius: 4,
      barThickness: 18,
    },
    {
      label: label2,
      data: data2,
      backgroundColor: "#f4a423",
      borderRadius: 4,
      barThickness: 18,
    },
  ],
});
