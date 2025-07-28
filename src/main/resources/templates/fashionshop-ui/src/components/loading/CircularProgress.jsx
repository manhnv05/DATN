import React, { useState, useEffect } from "react";
import { CircularProgress, Box, Fade } from "@mui/material";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const LoadingPageWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Khi path thay đổi => show loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // giả lập load
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Fade in={loading} unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
            transition: "all 0.3s ease",
          }}
        >
          <CircularProgress
            size={70}
            thickness={5}
            sx={{
              color: "#87CEFA", // xanh da trời nhạt
              opacity: 0.7, // làm nhạt hơn
            }}
          />
        </Box>
      </Fade>

      <Box sx={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.3s" }}>
        {children}
      </Box>
    </>
  );
};

LoadingPageWrapper.propTypes = {
  children: PropTypes.node,
};

export default LoadingPageWrapper;
