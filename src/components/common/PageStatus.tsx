import { Alert, Box, CircularProgress } from "@mui/material";

type PageStatusProps = {
  isLoading: boolean;
  error?: Error | null;
};

export default function PageStatus({ isLoading, error }: PageStatusProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          m: 1,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  return null;
}
