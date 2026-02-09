type MonthlyDataInput = {
  now?: Date;
  yearOffset?: number;
  registerCounts?: number[];
  externalCounts?: number[];
};

type MonthlyDataResult = {
  baseYear: number;
  yearLabel: string;
  monthLabels: string[];
  isCurrentMonthByIndex: boolean[];
  registerCounts: number[];
  externalCounts: number[];
};

export const calMonthlyData = ({
  yearOffset = 0,
  registerCounts = [],
  externalCounts = [],
}: MonthlyDataInput = {}): MonthlyDataResult => {
  const now = new Date();
  const baseYear = now.getFullYear() + yearOffset;
  const yearLabel = String(baseYear);
  const monthLabels = Array.from({ length: 12 }, (_, idx) => String(idx + 1));

  const isCurrentMonthByIndex = monthLabels.map(
    (_, idx) => baseYear === now.getFullYear() && idx === now.getMonth(),
  );

  return {
    baseYear,
    yearLabel,
    monthLabels,
    isCurrentMonthByIndex,
    registerCounts,
    externalCounts,
  };
};
