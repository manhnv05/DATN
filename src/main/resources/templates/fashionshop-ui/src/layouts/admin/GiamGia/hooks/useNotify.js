import { useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const useNotify = () => {
  const [state, setState] = useState({ open: false, message: "", severity: "success" });

  const notify = useCallback((message, severity = "success") => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setState((prev) => ({ ...prev, open: false }));
  };

  const Notification = (
      <Snackbar
          open={state.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={state.severity} sx={{ width: "100%" }}>
          {state.message}
        </Alert>
      </Snackbar>
  );

  return { notify, Notification };
};

export default useNotify;
