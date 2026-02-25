import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

type MuiSelectProps = {
  id: string;
  label?: string;
  checked?: boolean;
  error?: string;
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
};

export default function MuiCheckbox(props: MuiSelectProps) {
  const { id, label, checked, error, disabled, onChange } = props;

  const handleCheckboxFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(event, event.target.checked);
  };

  return (
    <FormControl error={!!error}>
      <FormControlLabel
        name={id}
        disabled={disabled}
        control={
          <Checkbox
            size="large"
            checked={checked ?? false}
            disabled={disabled}
            onChange={handleCheckboxFieldChange}
          />
        }
        label={label}
      />
      {error && <FormHelperText error={!!error}>{error}</FormHelperText>}
    </FormControl>
  );
}
