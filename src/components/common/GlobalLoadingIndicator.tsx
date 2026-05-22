import * as React from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setGlobalLoading } from "@/features/ui/uiSlice";
import { subscribeGlobalApiLoading } from "@shared/utils/apiLoading";

export default function GlobalLoadingIndicator() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.ui.globalLoading);

  React.useEffect(() => {
    return subscribeGlobalApiLoading((nextIsLoading) => {
      dispatch(setGlobalLoading(nextIsLoading));
    });
  }, [dispatch]);

  return (
    <Backdrop
      open={isLoading}
      aria-label="API loading"
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: "rgba(255, 255, 255, 0.28)",
        backdropFilter: "blur(1px)",
      }}
    >
      <Box
        sx={{
          width: 68,
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          backgroundColor: "background.paper",
          boxShadow: "0 8px 28px rgba(15, 23, 42, 0.18)",
        }}
      >
        <CircularProgress size={36} thickness={4.5} />
      </Box>
    </Backdrop>
  );
}
