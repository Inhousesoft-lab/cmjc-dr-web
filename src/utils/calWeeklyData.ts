type WeeklyDataInput = {
  now?: Date;
  weekOffset?: number;
  registerCounts?: number[];
  externalCounts?: number[];
};

type WeeklyDataResult = {
  baseDate: Date;
  startOfWeek: Date;
  weekDates: Date[];
  weekLabels: string[];
  isTodayByIndex: boolean[];
  monthLabel: string;
  weekOfMonth: number;
  monthWeekLabel: string;
  registerCounts: number[];
  externalCounts: number[];
};

export const calWeeklyData = ({
  now = new Date(),
  weekOffset = 0,
  registerCounts = [],
  externalCounts = [],
}: WeeklyDataInput = {}): WeeklyDataResult => {
  const baseDate = new Date(now);
  baseDate.setDate(now.getDate() + weekOffset * 7);

  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Sunday 기준

  const weekDates = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return d;
  });

  const monthLabel = `${baseDate.getFullYear()}-${String(
    baseDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const weekOfMonth =
    Math.floor((startOfWeek.getDate() + monthStart.getDay() - 1) / 7) + 1;
  const monthWeekLabel = `${monthLabel} ${weekOfMonth}주차`;
  const weekLabels = weekDates.map((d) => String(d.getDate()));
  const isTodayByIndex = weekDates.map(
    (d) => d.toDateString() === now.toDateString(),
  );

  return {
    baseDate,
    startOfWeek,
    weekDates,
    weekLabels,
    isTodayByIndex,
    monthLabel,
    weekOfMonth,
    monthWeekLabel,
    registerCounts,
    externalCounts,
  };
};
