import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const ConfirmDialog = ({
                           open,
                           title,
                           onClose,
                           onConfirm,
                           loading = false,
                           confirmText = "Xóa",
                       }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: 2,
                fontWeight: 700,
                fontSize: 20,
                pb: 1,
                pt: 2,
            }}
        >
            <span>{title}</span>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ color: (theme) => theme.palette.grey[500], ml: 2 }}
                size="large"
            >
                <CloseIcon sx={{ fontSize: 26 }} />
            </IconButton>
        </DialogTitle>
        <DialogActions sx={{ pb: 3, pt: 1, justifyContent: "center" }}>
            <Button
                variant="outlined"
                onClick={onClose}
                disabled={loading}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 400,
                    color: "#49a3f1",
                    borderColor: "#49a3f1",
                    boxShadow: "none",
                    background: "#fff",
                    mr: 1.5,
                    "&:hover": {
                        borderColor: "#1769aa",
                        background: "#f0f6fd",
                        color: "#1769aa",
                    },
                    "&.Mui-disabled": {
                        color: "#49a3f1",
                        borderColor: "#49a3f1",
                        opacity: 0.7,
                        background: "#fff",
                    },
                }}
            >
                Hủy
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={onConfirm}
                disabled={loading}
                sx={{ borderRadius: 2, minWidth: 90, fontWeight: 500 }}
            >
                {confirmText}
            </Button>
        </DialogActions>
    </Dialog>
);

ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    loading: PropTypes.bool,
    confirmText: PropTypes.string,
};

export default ConfirmDialog;
