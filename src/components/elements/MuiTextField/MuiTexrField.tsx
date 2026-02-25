// elements/MuiTextField.tsx
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import type { ChangeEventHandler, CSSProperties } from "react";

interface MuiTextFieldProps {
  id?: string;
  fullWidth?: boolean;
  variant?: "filled" | "outlined" | "standard";
  label?: string;
  isDisabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  isMulti?: boolean;
  width?: number | string;
  value?: string | number;
  name?: string;
  disabled?: boolean;
  style?: CSSProperties;
  inputProps?: TextFieldProps["inputProps"];
  onBlur?: TextFieldProps["onBlur"];
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default function MuiTextField({
  fullWidth = true,
  variant = "outlined",
  isDisabled = false,
  readOnly = false,
  isMulti = false,
  width,
  style,
  error,
  helperText,
  inputProps,
  ...props
}: MuiTextFieldProps) {
  const useFullWidth = width === undefined ? fullWidth : false;
  const appliedWidth = useFullWidth
    ? undefined
    : (width ?? style?.width ?? 200);
  const mergedStyle = appliedWidth
    ? { ...(style ?? {}), width: appliedWidth }
    : style;

  return (
    <TextField
      size="small"
      fullWidth={useFullWidth}
      variant={variant}
      error={error}
      disabled={isDisabled}
      helperText={helperText}
      multiline={isMulti}
      rows={isMulti ? 4 : 1}
      style={mergedStyle}
      slotProps={{ htmlInput: { readOnly } }}
      {...props}
    />
  );
}
