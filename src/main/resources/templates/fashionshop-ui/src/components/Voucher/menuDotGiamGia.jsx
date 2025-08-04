import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ThreeDotMenuDotGiamGia = ({ statusList, onSelectStatus }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (status) => {
        setSelectedStatus(status);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirm = () => {
        if (onSelectStatus && selectedStatus !== null) {
            onSelectStatus(selectedStatus);
        }
        setConfirmOpen(false);
        handleCloseMenu();
    };

    const getStatusText = (status) => {
        switch (status) {
            case 4:
                return 'Kết thúc';
            case 1:
                return 'Bắt đầu';
            case 3:
                return 'Tạm dừng';
            default:
                return '';
        }
    };

    return (
        <>
            <Tooltip title="Chọn trạng thái">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{
                        borderRadius: 2,
                        background: "#f5f6fa",
                        width: 40,
                        height: 40,
                        '&:hover': { background: "#e9ecef" },
                    }}
                    aria-label="Trạng thái"
                    aria-controls={openMenu ? 'status-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                >
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>

            <Menu
                id="status-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 150,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <MenuItem onClick={() => handleMenuItemClick(3)} sx={{ fontSize: '14px' }}>
                    Tạm Dừng
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(1)} sx={{ fontSize: '14px' }}>
                    Bắt đầu
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(4)} sx={{ fontSize: '14px' }}>
                    Kết thúc
                </MenuItem>
            </Menu>

            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn chuyển sang trạng thái &quot;<strong>{getStatusText(selectedStatus)}</strong>&quot; không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Hủy</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

ThreeDotMenuDotGiamGia.propTypes = {
    statusList: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectStatus: PropTypes.func,
};

export default ThreeDotMenuDotGiamGia;
