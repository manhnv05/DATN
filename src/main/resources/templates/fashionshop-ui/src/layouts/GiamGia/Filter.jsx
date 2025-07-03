import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SoftTypography from "components/SoftTypography";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "flatpickr/dist/flatpickr.min.css";
import Box from "@mui/material/Box";
import "flatpickr/dist/themes/airbnb.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

const Filter = ({ filter = {}, setFilter }) => {
    const navigate = useNavigate();
    const [valueBatDau, setValueBatDau] = useState(null)
    const [valueKetThuc, setValueKetThuc] = useState(null)
    const debounceMapRef = useRef({});
    const searchValue = filter.tenDotGiamGia || "";
    const selectedStatus = STATUS_LIST.find((s) => s.id === filter.trangThai) || null;
    const dateRange =
        filter.ngayBatDau && filter.ngayKetThuc ? [filter.ngayBatDau, filter.ngayKetThuc] : [];

    const getDebouncedHandler = (key) => {
        if (!debounceMapRef.current[key]) {
            debounceMapRef.current[key] = debounce((newValue) => {
                setFilter((pre) => ({ ...pre, [key]: newValue }));
            }, 500);
        }
        return debounceMapRef.current[key];
    };

    // const handleDateChange = (dates) => {
    //     const [start, end] = dates || [];
    //     setFilter((pre) => ({
    //         ...pre,
    //         ngayBatDau: start,
    //         ngayKetThuc: end,
    //     }));
    // };

    useEffect(() => {
        setFilter((pre) => ({
            ...pre,
            ngayBatDau: valueBatDau,
            ngayKetThuc: valueKetThuc,
        }));
    }, [valueBatDau, valueKetThuc])

    const handleChangeBatDau = (newValue) => {
        setValueBatDau(newValue);
    };
    const handleChangeKetThuc = (newValue) => {
        setValueKetThuc(newValue);
    };

    const handleClearFilter = () => {
        setValueBatDau(null)
        setValueKetThuc(null)
    };

    return (
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <SoftTypography sx={{ fontWeight: 500 }}>Bộ lọc</SoftTypography>
            <Grid container columnSpacing={1.5}>
                <Grid item xs={3}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm đợt giảm giá"
                        value={searchValue}
                        onChange={(e) => {
                            getDebouncedHandler("tenDotGiamGia")(e.target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon fontSize="small" sx={{ color: "#868686" }}>
                                        search
                                    </Icon>
                                </InputAdornment>
                            )
                        }}
                        sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        options={STATUS_LIST}
                        renderOption={renderOption}
                        value={selectedStatus}
                        onChange={(e, value) => {
                            getDebouncedHandler("trangThai")(value?.id);
                        }}
                        renderInput={(params) => (
                            <TextField
                                placeholder="Trạng thái"
                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                                {...params}
                            />
                        )}
                    />
                </Grid>
                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                    <Box sx={{ flex: 1, maxWidth: 220 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Ngày bắt đầu"
                                value={valueBatDau}
                                onChange={handleChangeBatDau}
                                renderInput={(props) => (
                                    <TextField
                                        {...props}
                                        fullWidth
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                height: "56px",
                                                fontSize: "16px",
                                            },
                                            "& .MuiInputBase-input": {
                                                padding: "16.5px 14px",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                border: "none",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                    <Box sx={{ flex: 1, maxWidth: 220 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Ngày kết thúc"
                                value={valueKetThuc}
                                onChange={handleChangeKetThuc}
                                renderInput={(props) => (
                                    <TextField
                                        {...props}
                                        fullWidth
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                height: "56px",
                                                fontSize: "16px",
                                            },
                                            "& .MuiInputBase-input": {
                                                padding: "16.5px 14px",
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                border: "none",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
                <Grid
                    item
                    xs={3}
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={1}
                    sx={{
                        flexWrap: "nowrap",
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={handleClearFilter}
                        sx={{
                            color: "#4acbf2",
                            marginBottom: 2,
                            marginRight: 6
                        }}
                        title="Xóa bộ lọc"
                    >
                        <FaTimes />
                    </IconButton>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FaPlus />}
                        sx={{
                            px: 1,
                            height: "fit-content",
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 400,
                            marginBottom: 2,
                            color: "#49a3f1",
                            borderColor: "#49a3f1",
                            boxShadow: "none",
                            "&:hover": {
                                borderColor: "#1769aa",
                                background: "#f0f6fd",
                                color: "#1769aa",
                            },
                        }}
                        onClick={() => {
                            navigate("/discount-event/add");
                        }}
                    >
                        Thêm đợt giảm giá
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

export default Filter;

export const STATUS_LIST = [
    {
        id: 1,
        label: "Đang diễn ra",
    },
    {
        id: 2,
        label: "Chưa diễn ra",
    },
];

const renderOption = (props, option) => {
    return (
        <MenuItem {...props} key={[option?.id, option?.code, option?.value].filter(Boolean).join("_")}>
            {option?.label}
        </MenuItem>
    );
};

Filter.propTypes = {
    setFilter: PropTypes.func.isRequired,
    filter: PropTypes.object,
};