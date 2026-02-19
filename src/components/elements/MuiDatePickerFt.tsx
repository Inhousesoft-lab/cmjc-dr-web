// DatePickerFt.tsx
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

type Props = {
  // 비즈니스/RHF에서 사용하는 값: 'YYYYMMDD' 또는 ''
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  minDate?: string;
  error?: boolean; // 에러 상태
  helperText?: string; // 도움말/에러 메시지
};

export function MuiDatePickerFt({
  value,
  onChange,
  label,
  disabled,
  minDate,
  error,
  helperText,
}: Props) {
  const dayjsValue = value ? dayjs(value, "YYYY-MM-DD") : null;
  const dayjsMinDate = minDate ? dayjs(minDate, "YYYY-MM-DD") : undefined;

  return (
    <DatePicker
      label={label}
      format="YYYY-MM-DD"
      disabled={disabled}
      minDate={dayjsMinDate}
      value={dayjsValue}
      onChange={(date) =>
        onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
      }
      slotProps={{
        textField: {
          size: "small",
          error,
          helperText,
          ...(helperText === "" && { helperText: "" }),
        },
      }}
    />
  );
}
