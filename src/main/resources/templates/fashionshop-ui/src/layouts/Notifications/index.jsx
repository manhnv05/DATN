import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import MuiAlert from "@mui/material/Alert";
import PropTypes from "prop-types";

/**
 * Notifications component
 * Hiển thị thông báo thành công, thất bại hoặc cảnh báo cho toàn app.
 *
 * Props:
 * - open: boolean, có hiển thị thông báo không
 * - onClose: function, callback khi đóng thông báo
 * - message: string, nội dung thông báo
 * - severity: "success" | "error" | "warning" | "info"
 * - autoHideDuration: số ms thông báo tự ẩn (mặc định 2500)
 * - anchorOrigin: vị trí hiện thông báo (mặc định top-center)
 */
function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const customColors = {
    success: {
        background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
        color: "#155724",
        iconColor: "#20c997",
    },
    error: {
        background: "linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%)",
        color: "#fff",
        iconColor: "#ff1744",
    },
    warning: {
        background: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
        color: "#856404",
        iconColor: "#ffb300",
    },
    info: {
        background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
        color: "#fff",
        iconColor: "#1976d2",
    },
};

function Notifications({
                           open,
                           onClose,
                           message,
                           severity = "info",
                           autoHideDuration = 2500,
                           anchorOrigin = { vertical: "top", horizontal: "center" },
                       }) {
    const colorStyles = customColors[severity] || customColors.info;

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
            anchorOrigin={anchorOrigin}
            TransitionComponent={SlideTransition}
            sx={{
                zIndex: 13000,
            }}
        >
            <MuiAlert
                onClose={onClose}
                severity={severity}
                iconMapping={{
                    success: <span style={{ fontSize: 22, color: colorStyles.iconColor }}>✔️</span>,
                    error: <span style={{ fontSize: 22, color: colorStyles.iconColor }}>⛔</span>,
                    warning: <span style={{ fontSize: 22, color: colorStyles.iconColor }}>⚠️</span>,
                    info: <span style={{ fontSize: 22, color: colorStyles.iconColor }}>ℹ️</span>,
                }}
                elevation={8}
                variant="filled"
                sx={{
                    width: "100%",
                    minWidth: 330,
                    maxWidth: 500,
                    fontWeight: 600,
                    fontSize: 17,
                    letterSpacing: 0.2,
                    borderRadius: 2.5,
                    background: colorStyles.background,
                    color: colorStyles.color,
                    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.13)",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {message}
            </MuiAlert>
        </Snackbar>
    );
}

Notifications.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    message: PropTypes.node.isRequired,
    severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
    autoHideDuration: PropTypes.number,
    anchorOrigin: PropTypes.object,
};

export default Notifications;