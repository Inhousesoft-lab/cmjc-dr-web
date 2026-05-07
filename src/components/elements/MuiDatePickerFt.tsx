// DatePickerFt.tsx
import * as React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

type Props = {
  // 비즈니스/RHF에서 사용하는 값: 'YYYYMMDD' 또는 ''
  value: string;
  name?: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  error?: boolean; // 에러 상태
  helperText?: string; // 도움말/에러 메시지
};

export function MuiDatePickerFt({
  value,
  name,
  onChange,
  label,
  disabled,
  minDate,
  maxDate,
  error,
  helperText,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const parsedValue = value ? dayjs(value, "YYYYMMDD", true) : null;
  const parsedMinDate = minDate ? dayjs(minDate, "YYYYMMDD", true) : null;
  const parsedMaxDate = maxDate ? dayjs(maxDate, "YYYYMMDD", true) : dayjs("99991231", "YYYYMMDD", true);

  const dayjsValue = parsedValue?.isValid() ? parsedValue : null;
  const dayjsMinDate = parsedMinDate?.isValid() ? parsedMinDate : undefined;
  const dayjsMaxDate = parsedMaxDate?.isValid() ? parsedMaxDate : undefined;
  const openCalendar = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  return (
    <DatePicker
      open={open}
      onOpen={openCalendar}
      onClose={() => setOpen(false)}
      label={label}
      name={name}
      format="YYYY-MM-DD"
      disabled={disabled}
      minDate={dayjsMinDate}
      maxDate={dayjsMaxDate}
      value={dayjsValue}
      onChange={(date) =>
        onChange(date && dayjs(date).isValid() ? dayjs(date).format("YYYYMMDD") : "")
      }
      slotProps={{
        textField: {
          size: "small",
          error,
          helperText,
          onClick: openCalendar,
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openCalendar();
            }
          },
          ...(helperText === "" && { helperText: "" }),
        },
      }}
    />
  );
}
