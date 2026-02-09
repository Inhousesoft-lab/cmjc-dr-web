import { Grid, Typography } from "@mui/material";

const GridField = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <>
    <Grid
      size={{ xs: 4, sm: 2 }}
      className={`guest-card-view__label-cell${
        fullWidth ? " guest-card-view__cell--full" : ""
      }`}
    >
      <Typography variant="subtitle2">{label}</Typography>
    </Grid>
    <Grid
      size={{ xs: 8, sm: 4 }}
      className={`guest-card-view__value-cell${
        fullWidth ? " guest-card-view__cell--full" : ""
      }`}
    >
      <Typography variant="body2">{value}</Typography>
    </Grid>
  </>
);
export default GridField;
