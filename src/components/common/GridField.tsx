import { Grid, Typography } from "@mui/material";

const GridField = ({
  label,
  value,
  item = 6,
}: {
  label: string;
  value: React.ReactNode;
  item?: 12 | 9 | 8 | 6 | 4 | 3;
  fullWidth?: boolean;
}) => {
  const sizeMap = {
    12: {
      label: { xs: 4, sm: 2 },
      value: { xs: 8, sm: 10 },
    },
    9: {
      label: { xs: 4, sm: 1 },
      value: { xs: 8, sm: 8 },
    },
    8: {
      label: { xs: 4, sm: 1 },
      value: { xs: 8, sm: 7 },
    },
    6: {
      label: { xs: 4, sm: 2 },
      value: { xs: 8, sm: 4 },
    },
    4: {
      label: { xs: 4, sm: 1 },
      value: { xs: 8, sm: 3 },
    },
    3: {
      label: { xs: 4, sm: 1 },
      value: { xs: 8, sm: 2 },
    },
  } as const;

  const size = sizeMap[item];

  return (
    <>
      <Grid size={size.label} className={`table-view__label-cell`}>
        <Typography variant="subtitle2">{label}</Typography>
      </Grid>
      <Grid size={size.value} className={`table-view__value-cell`}>
        <Typography component="div" variant="body2">
          {value}
        </Typography>
      </Grid>
    </>
  );
};
export default GridField;
