import { SelectItem } from "@/features/com/CommonTypes";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import type { Ref } from "react";

interface Props {
  inputRef?: Ref<HTMLSelectElement | null>;
  id: string;
  label?: string;
  items?: SelectItem[];
  defaultValue?: string;
  value?: string;
  error?: boolean;
  helperText?: string;
  isDisabled?: boolean;
  width?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MuiSelect({
  inputRef,
  id,
  label,
  items,
  defaultValue,
  value,
  error,
  helperText,
  isDisabled,
  onChange,
}: Props) {
  const normalizedValue = (() => {
    if (value === undefined || value === null) return "";
    const nextValue = String(value);
    const hasMatch =
      (items ?? []).some((item) => String(item.code) === nextValue) ||
      nextValue === "";
    return hasMatch ? nextValue : "";
  })();

  return (
    <FormControl size="small" error={!!error} fullWidth>
      <Select
        fullWidth
        inputRef={inputRef}
        id={id}
        labelId={id + "-label"}
        name={id}
        label={label}
        defaultValue={defaultValue}
        value={normalizedValue}
        onChange={onChange as SelectProps["onChange"]}
        displayEmpty
        disabled={isDisabled}
      >
        {items?.map((item, index) => (
          <MenuItem key={`${item.code}-${index}`} value={item.code}>
            <Typography noWrap>{item.name}</Typography>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
