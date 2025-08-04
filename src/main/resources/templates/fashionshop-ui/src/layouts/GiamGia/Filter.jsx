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
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "flatpickr/dist/themes/airbnb.css";
import dayjs from "dayjs";
import FilterListIcon from "@mui/icons-material/FilterList";

export function debounce(functionCallback, timeout = 500) {
    let timer;
    return (...argumentsList) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            functionCallback(...argumentsList);
        }, timeout);
    };
}

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

function renderOption(properties, option) {
    return (
        <MenuItem {...properties} key={[option?.id, option?.code, option?.value].filter(Boolean).join("_")}>
            {option?.label}
        </MenuItem>
    );
}

function ProductFilter({ filter = {}, setFilter, categories = [], onClose }) {
    const debounceMapRef = useRef({});

    function getDebouncedHandler(key) {
        if (!debounceMapRef.current[key]) {
            debounceMapRef.current[key] = debounce((newValue) => {
                setFilter((previous) => ({ ...previous, [key]: newValue }));
            }, 500);
        }
        return debounceMapRef.current[key];
    }

    function handleClear() {
        setFilter((previous) => ({
            ...previous,
            tenSanPham: "",
            tenDanhMuc: "",
        }));
    }

    return (
        <Card sx={{ p: 2, minWidth: 350 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Tên sản phẩm"
                        placeholder="Nhập tên sản phẩm"
                        value={filter.tenSanPham || ""}
                        onChange={event => getDebouncedHandler("tenSanPham")(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Danh mục"
                        value={filter.tenDanhMuc || ""}
                        onChange={event => setFilter((previous) => ({ ...previous, tenDanhMuc: event.target.value }))}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {(categories || []).map((category) => (
                            <MenuItem value={category} key={category}>{category}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
                    <Grid item>
                        <IconButton size="small" onClick={handleClear} color="error" title="Xóa lọc">
                            <FaTimes />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<FilterListIcon />}
                            onClick={onClose}
                        >
                            Áp dụng
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}

ProductFilter.propTypes = {
    filter: PropTypes.object,
    setFilter: PropTypes.func,
    categories: PropTypes.array,
    onClose: PropTypes.func,
};

function Filter({ filter = {}, setFilter }) {
    const navigate = useNavigate();
    const debounceMapRef = useRef({});

    const [fromDate, setFromDate] = useState(filter.ngayBatDau ? dayjs(filter.ngayBatDau) : null);
    const [toDate, setToDate] = useState(filter.ngayKetThuc ? dayjs(filter.ngayKetThuc) : null);
    const searchValue = filter.tenDotGiamGia || "";
    const selectedStatus = STATUS_LIST.find((status) => status.id === filter.trangThai) || null;

    useEffect(() => {
        setFilter((previous) => ({
            ...previous,
            ngayBatDau: fromDate ? fromDate.format("YYYY-MM-DD") : undefined,
            ngayKetThuc: toDate ? toDate.format("YYYY-MM-DD") : undefined,
        }));
    }, [fromDate, toDate, setFilter]);

    function getDebouncedHandler(key) {
        if (!debounceMapRef.current[key]) {
            debounceMapRef.current[key] = debounce((newValue) => {
                setFilter((previous) => ({ ...previous, [key]: newValue }));
            }, 500);
        }
        return debounceMapRef.current[key];
    }

    function handleClearFilter() {
        setFilter((previous) => ({
            ...previous,
            tenDotGiamGia: "",
            trangThai: undefined,
            ngayBatDau: undefined,
            ngayKetThuc: undefined,
        }));
        setFromDate(null);
        setToDate(null);
    }

    return (
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <SoftTypography sx={{ fontWeight: 500 }}>Bộ lọc</SoftTypography>
            <Grid container columnSpacing={1.5}>
                <Grid item xs={3}>
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm đợt giảm giá"
                        value={searchValue}
                        onChange={event => {
                            getDebouncedHandler("tenDotGiamGia")(event.target.value);
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
                        onChange={(event, value) => {
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
                <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="Từ ngày"
                                    value={fromDate}
                                    onChange={setFromDate}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Tìm theo khoảng thời gian"
                                            fullWidth
                                            sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="Đến ngày"
                                    value={toDate}
                                    onChange={setToDate}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Tìm theo khoảng thời gian"
                                            fullWidth
                                            sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Grid>
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
                        sx={{ color: "#4acbf2" }}
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
}

Filter.propTypes = {
    filter: PropTypes.object,
    setFilter: PropTypes.func,
};

export default Filter;
