import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STATUS_LIST } from "./Filter";
import Table from "examples/Tables/Table";
import SoftBox from "components/SoftBox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import instanceAPIMain from "../../configapi";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

export function debounce(functionCallback, timeout = 500) {
    let timer;
    return (...argumentsList) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            functionCallback(...argumentsList);
        }, timeout);
    };
}

export const createDotGiamGia = (payload) =>
    instanceAPIMain.post("/dotGiamGia", payload);

export const applyDotGiamGia = (payload) =>
    instanceAPIMain.post("/chiTietDotGiamGia/apply", payload);

export const getDotGiamGiaById = (id) =>
    instanceAPIMain.get(`/dotGiamGia/${id}`);

export const updateDotGiamGia = (id, payload) =>
    instanceAPIMain.put(`/dotGiamGia/${id}`, payload);

export const getChiTietDotGiamGiaByDot = (idDot) =>
    instanceAPIMain.get(`/chiTietDotGiamGia/by-dot-giam-gia/${idDot}`);

export const getChiTietBySanPham = (idSanPham) =>
    instanceAPIMain.get(`/chiTietSanPham/by-san-pham/${idSanPham}`);

export const searchSanPham = (keyword) =>
    instanceAPIMain.get("/sanPham/search", {
        params: { keyword },
    });

export const getSanPham = (params) =>
    instanceAPIMain.get("/sanPham", { params });

export const getSanPhamById = (id) => instanceAPIMain.get(`/sanPham/${id}`);

export const getImageByChiTiet = (idChiTiet) =>
    instanceAPIMain.get("/hinhAnh", {
        params: { idSanPhamChiTiet: idChiTiet, page: 0, size: 1 },
    });

function formatPrice(value) {
    if (value !== undefined && value !== null) {
        return value.toLocaleString("vi-VN") + " ₫";
    }
    return "";
}

function getDiscountPrice(price, percent) {
    if (price !== undefined && price !== null) {
        return price - (price * (Number(percent) || 0)) / 100;
    }
    return price;
}

function getPaginationItems(current, total) {
    if (total <= 4) {
        return Array.from({ length: total }, function (_, index) { return index; });
    }
    if (current <= 1) {
        return [0, 1, "...", total - 2, total - 1];
    }
    if (current >= total - 2) {
        return [0, 1, "...", total - 2, total - 1];
    }
    return [0, 1, "...", current, "...", total - 2, total - 1];
}

const viewOptions = [5, 10, 20];

const INIT = {
    trangThai: 1,
    tenDotGiamGia: "",
    phanTramGiamGia: "",
    ngayBatDau: null,
    ngayKetThuc: null,
    dateRange: [],
};

function ProductFilter({ filter = {}, setFilter, categories = [], onClose }) {
    const debounceMapRef = useRef({});

    function getDebouncedHandler(key) {
        if (!debounceMapRef.current[key]) {
            debounceMapRef.current[key] = debounce((newValue) => {
                setFilter((pre) => ({ ...pre, [key]: newValue }));
            }, 500);
        }
        return debounceMapRef.current[key];
    }

    function handleClear() {
        setFilter((pre) => ({
            ...pre,
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
                        onChange={e => getDebouncedHandler("tenSanPham")(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Danh mục"
                        value={filter.tenDanhMuc || ""}
                        onChange={e => setFilter((pre) => ({ ...pre, tenDanhMuc: e.target.value }))}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {(categories || []).map((cat) => (
                            <MenuItem value={cat} key={cat}>{cat}</MenuItem>
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

function AddDiscountEventPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { reset, handleSubmit, control, watch } = useForm({
        defaultValues: INIT,
    });
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [details, setDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [eventId, setEventId] = useState(id);
    const [productPage, setProductPage] = useState(0);
    const [productTotalPages, setProductTotalPages] = useState(1);
    const [productPageSize, setProductPageSize] = useState(10);

    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [productFilter, setProductFilter] = useState({ tenSanPham: "", tenDanhMuc: "" });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await instanceAPIMain.get("/danhMuc/all");
                if (res.status === 200) {
                    setCategories(res.data ? res.data.map(function (d) { return d.tenDanhMuc; }) : []);
                }
            } catch { }
        }
        fetchCategories();
    }, []);

    useEffect(function () {
        async function fetchData() {
            if (id) {
                const res = await getDotGiamGiaById(id);
                if (res.status === 200) {
                    const payload = res.data || {};
                    reset({
                        tenDotGiamGia: payload.tenDotGiamGia,
                        phanTramGiamGia: payload.phanTramGiamGia,
                        ngayBatDau: payload.ngayBatDau,
                        ngayKetThuc: payload.ngayKetThuc,
                        trangThai: payload.trangThai,
                        dateRange: [payload.ngayBatDau, payload.ngayKetThuc],
                    });
                    setEventId(payload.id);
                    const detailRes = await getChiTietDotGiamGiaByDot(payload.id);
                    if (detailRes.status === 200) {
                        const list = detailRes.data || [];
                        setSelectedDetails(list.map(function (d) { return d.idSanPhamChiTiet; }));
                        const proIds = Array.from(new Set(list.map(function (d) { return d.idSanPham; })));
                        for (let pid of proIds) {
                            const proRes = await getSanPhamById(pid);
                            if (proRes.status === 200) {
                                setSelectedProducts(function (pre) { return [...pre, proRes.data]; });
                            }
                            await fetchDetails(pid);
                        }
                    }
                }
            }
        }
        fetchData();
    }, [id, reset]);

    const discountValue = watch("phanTramGiamGia");

    const preDetailMap = React.useMemo(function () {
        return details.reduce(function (acc, item) {
            if (!acc[item.idSanPham]) acc[item.idSanPham] = [];
            acc[item.idSanPham].push(item.id);
            return acc;
        }, {});
    }, [details]);

    async function fetchDetails(idSanPham) {
        const res = await getChiTietBySanPham(idSanPham);
        if (res.status === 200) {
            const list = res.data || [];
            const detailWithImg = await Promise.all(
                list.map(async function (it) {
                    try {
                        const imgRes = await getImageByChiTiet(it.id);
                        return {
                            ...it,
                            idSanPham: idSanPham,
                            image: imgRes.data && imgRes.data.content && imgRes.data.content[0] && imgRes.data.content[0].duongDanAnh ? imgRes.data.content[0].duongDanAnh : "",
                        };
                    } catch {
                        return { ...it, idSanPham: idSanPham, image: "" };
                    }
                })
            );
            setDetails(function (pre) {
                const existedIds = new Set(pre.map(function (d) { return d.id; }));
                const add = detailWithImg.filter(function (d) { return !existedIds.has(d.id); });
                return [...pre, ...add];
            });
        }
    }

    async function fetchProductsList(page = 0, size = productPageSize, filter = productFilter) {
        const params = { page: page, size: size };
        if (filter.tenSanPham) params.tenSanPham = filter.tenSanPham;
        if (filter.tenDanhMuc) params.tenDanhMuc = filter.tenDanhMuc;
        const res = await getSanPham(params);
        if (res.status === 200) {
            const list = res.data && res.data.content ? res.data.content : res.data || [];
            setProducts(list);
            setProductTotalPages(res.data && res.data.totalPages ? res.data.totalPages : 1);
            setProductPage(res.data && typeof res.data.number === "number" ? res.data.number : 0);
        }
    }

    useEffect(function () {
        fetchProductsList(productPage, productPageSize, productFilter);
    }, [productPage, productPageSize, productFilter]);

    const debounceRef = useRef(
        debounce(function (value) {
            setProductPage(0);
            setProductFilter(function (prev) { return { ...prev, tenSanPham: value }; });
        }, 500)
    );

    const productColumns = React.useMemo(
        function () {
            return [
                {
                    name: "checkbox",
                    label: (
                        <Checkbox
                            sx={{
                                color: "#111",
                                "&.Mui-checked": { color: "#111" },
                                "& .MuiSvgIcon-root": {
                                    border: "1.5px solid #111",
                                    borderRadius: "4px",
                                },
                            }}
                            checked={
                                products.length > 0 &&
                                products.every(function (p) {
                                    return selectedProducts.some(function (sp) {
                                        return sp.id === p.id;
                                    });
                                })
                            }
                            indeterminate={
                                products.length > 0 &&
                                products.some(function (p) {
                                    return selectedProducts.some(function (sp) {
                                        return sp.id === p.id;
                                    });
                                }) &&
                                !products.every(function (p) {
                                    return selectedProducts.some(function (sp) {
                                        return sp.id === p.id;
                                    });
                                })
                            }
                            onChange={function (_, checked) {
                                if (checked) {
                                    const newSelected = products.filter(function (p) {
                                        return !selectedProducts.some(function (sp) { return sp.id === p.id; });
                                    });
                                    setSelectedProducts(function (pre) { return [...pre, ...newSelected]; });
                                    newSelected.forEach(function (row) { fetchDetails(row.id); });
                                } else {
                                    setSelectedProducts(function (pre) {
                                        return pre.filter(function (p) {
                                            return !products.some(function (prod) { return prod.id === p.id; });
                                        });
                                    });
                                    setDetails(function (pre) {
                                        return pre.filter(function (d) {
                                            return !products.some(function (prod) { return prod.id === d.idSanPham; });
                                        });
                                    });
                                    setSelectedDetails(function (pre) {
                                        return pre.filter(function (id) {
                                            return !products.some(function (prod) {
                                                return preDetailMap[prod.id] && preDetailMap[prod.id].includes(id);
                                            });
                                        });
                                    });
                                }
                            }}
                        />
                    ),
                    width: "50px",
                    align: "center",
                    render: function (_, row) {
                        return (
                            <Checkbox
                                sx={{
                                    color: "#111",
                                    "&.Mui-checked": { color: "#111" },
                                    "& .MuiSvgIcon-root": {
                                        border: "1.5px solid #111",
                                        borderRadius: "4px",
                                    },
                                }}
                                checked={!!selectedProducts.find(function (p) { return p.id === row.id; })}
                                onChange={function (_, checked) {
                                    if (checked) {
                                        if (!selectedProducts.find(function (p) { return p.id === row.id; })) {
                                            setSelectedProducts(function (pre) { return [...pre, row]; });
                                        }
                                        fetchDetails(row.id);
                                    } else {
                                        setSelectedProducts(function (pre) { return pre.filter(function (p) { return p.id !== row.id; }); });
                                        setDetails(function (pre) { return pre.filter(function (d) { return d.idSanPham !== row.id; }); });
                                        setSelectedDetails(function (pre) {
                                            return pre.filter(function (id) {
                                                return !(preDetailMap[row.id] && preDetailMap[row.id].includes(id));
                                            });
                                        });
                                    }
                                }}
                            />
                        );
                    },
                },
                { name: "tenSanPham", label: "Tên", align: "center" },
                { name: "tenDanhMuc", label: "Danh mục", align: "center" },
            ];
        },
        [selectedProducts, details, preDetailMap, products]
    );

    const selectedColumns = React.useMemo(
        function () {
            return [
                {
                    name: "checkbox",
                    label: (
                        <Checkbox
                            sx={{
                                color: "#111",
                                "&.Mui-checked": { color: "#111" },
                                "& .MuiSvgIcon-root": {
                                    border: "1.5px solid #111",
                                    borderRadius: "4px",
                                },
                            }}
                            checked={
                                details.length > 0 &&
                                details.every(function (d) { return selectedDetails.includes(d.id); })
                            }
                            indeterminate={
                                selectedDetails.length > 0 &&
                                selectedDetails.length < details.length
                            }
                            onChange={function (_, checked) {
                                if (checked) {
                                    const allIds = details
                                        .filter(function (d) { return !selectedDetails.includes(d.id); })
                                        .map(function (d) { return d.id; });
                                    setSelectedDetails(function (pre) { return [...pre, ...allIds]; });
                                } else {
                                    setSelectedDetails(function (pre) { return pre.filter(function (id) { return !details.find(function (d) { return d.id === id; }); }); });
                                }
                            }}
                        />
                    ),
                    width: "50px",
                    align: "center",
                    render: function (_, row) {
                        return (
                            <Checkbox
                                sx={{
                                    color: "#111",
                                    "&.Mui-checked": { color: "#111" },
                                    "& .MuiSvgIcon-root": {
                                        border: "1.5px solid #111",
                                        borderRadius: "4px",
                                    },
                                }}
                                checked={selectedDetails.includes(row.id)}
                                onChange={function (_, checked) {
                                    if (checked) {
                                        setSelectedDetails(function (pre) { return [...pre, row.id]; });
                                    } else {
                                        setSelectedDetails(function (pre) { return pre.filter(function (id) { return id !== row.id; }); });
                                    }
                                }}
                            />
                        );
                    },
                },
                {
                    name: "image",
                    label: "Ảnh",
                    width: "80px",
                    align: "center",
                    render: function (v) {
                        return v ? <img src={v} alt="img" width={50} /> : null;
                    },
                },
                {
                    name: "info",
                    label: "Thông tin chung",
                    align: "center",
                    render: function (_, row) {
                        return (
                            <SoftBox lineHeight={1.2}>
                                <SoftTypography display="block" variant="button" fontWeight="medium">
                                    {row.tenSanPham} - {row.maSanPhamChiTiet}
                                </SoftTypography>
                                <SoftTypography display="block" variant="caption" color="text">
                                    Giá sau mã: {formatPrice(getDiscountPrice(row.gia, discountValue))}
                                </SoftTypography>
                                <SoftTypography display="block" variant="caption" color="text">
                                    Giá gốc: {formatPrice(row.gia)}
                                </SoftTypography>
                            </SoftBox>
                        );
                    },
                },
                {
                    name: "detail",
                    label: "Chi tiết",
                    align: "center",
                    render: function (_, row) {
                        return (
                            <SoftBox lineHeight={1.2}>
                                <SoftTypography display="block" variant="caption" color="text">
                                    Kích cỡ: {row.tenKichThuoc}
                                </SoftTypography>
                                <SoftTypography display="block" variant="caption" color="text">
                                    Màu sắc: {row.tenMauSac}
                                </SoftTypography>
                            </SoftBox>
                        );
                    },
                },
            ];
        },
        [selectedDetails, discountValue, details]
    );

    async function onSubmit(data) {
        if (!data.tenDotGiamGia || !data.tenDotGiamGia.trim()) {
            toast.error("Vui lòng nhập tên đợt giảm giá");
            return;
        }
        if (!data.phanTramGiamGia || String(data.phanTramGiamGia).trim() === "") {
            toast.error("Vui lòng nhập phần trăm giảm giá");
            return;
        }
        if (Number(data.phanTramGiamGia) <= 0) {
            toast.error("Phần trăm giảm giá phải lớn hơn 0");
            return;
        }
        if (Number(data.phanTramGiamGia) > 50) {
            toast.error("Phần trăm giảm giá phải nhỏ hơn hoặc bằng 50");
            return;
        }
        if (!data.dateRange || data.dateRange.length !== 2) {
            toast.error("Vui lòng chọn khoảng thời gian áp dụng");
            return;
        }
        try {
            const start = data.dateRange[0];
            const end = data.dateRange[1];
            const payload = {
                tenDotGiamGia: data.tenDotGiamGia,
                phanTramGiamGia: Number(data.phanTramGiamGia),
                ngayBatDau: start,
                ngayKetThuc: end,
                trangThai: data.trangThai,
            };
            let res;
            if (eventId) {
                res = await updateDotGiamGia(eventId, { ...payload, id: eventId });
            } else {
                res = await createDotGiamGia(payload);
            }
            const idDotGiamGia = eventId || res.data;
            setEventId(idDotGiamGia);
            toast.success(eventId ? "Cập nhật thành công" : "Thêm thành công");
        } catch (e) {
            toast.error("Thao tác thất bại");
        }
    }

    async function handleApply() {
        if (!eventId || selectedDetails.length === 0) {
            toast.error("Vui lòng chọn sản phẩm chi tiết để áp dụng!");
            return;
        }
        try {
            await applyDotGiamGia({
                idDotGiamGia: eventId,
                idSanPhamChiTietList: selectedDetails,
            });
            toast.success("Áp dụng thành công");
            navigate("/discount-event");
        } catch (e) {
            toast.error("Áp dụng thất bại");
        }
    }

    function handleReset() {
        reset();
    }

    const productPaginationItems = getPaginationItems(productPage, productTotalPages);

    return (
        <DashboardLayout>
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <DashboardNavbar />
            <Stack direction="row" justifyContent="flex-end">
                <Button
                    startIcon={<FaArrowLeft />}
                    onClick={function () {
                        navigate("/discount-event");
                    }}
                >
                    Quay lại
                </Button>
            </Stack>
            <Stack direction="row" spacing={3} mb={3}>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftTypography sx={{ fontWeight: 500 }}>Chỉnh sửa đợt giảm giá</SoftTypography>
                    <Stack
                        spacing={1}
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ width: 400 }}
                    >
                        <Stack>
                            <InputLabel required>Tên đợt giảm giá</InputLabel>
                            <Controller
                                name="tenDotGiamGia"
                                control={control}
                                render={function ({ field }) {
                                    return (
                                        <TextField
                                            id="tenDotGiamGia"
                                            {...field}
                                            placeholder="Nhập tên đợt giảm giá"
                                        />
                                    );
                                }}
                            />
                        </Stack>
                        <Stack>
                            <InputLabel required>Phần trăm giảm giá</InputLabel>
                            <Controller
                                name="phanTramGiamGia"
                                control={control}
                                render={function ({ field }) {
                                    return (
                                        <TextField
                                            type="number"
                                            id="phanTramGiamGia"
                                            {...field}
                                            placeholder="Nhập phần trăm giảm giá"
                                        />
                                    );
                                }}
                            />
                        </Stack>
                        <Stack>
                            <InputLabel required>Thời gian áp dụng</InputLabel>
                            <Box display="flex" flexDirection="row" gap={2} mb={2} sx={{ marginTop: 1 }}>
                                <Box sx={{ flex: 1, maxWidth: 190 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="ngayBatDau"
                                            control={control}
                                            defaultValue={null}
                                            render={function ({ field }) {
                                                return (
                                                    <DateTimePicker
                                                        label="Ngày bắt đầu"
                                                        renderInput={function (props) {
                                                            return (
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
                                                            );
                                                        }}
                                                        value={field.value}
                                                        onChange={function (newValue) {
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{ flex: 1, maxWidth: 190 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="ngayKetThuc"
                                            control={control}
                                            defaultValue={null}
                                            render={function ({ field }) {
                                                return (
                                                    <DateTimePicker
                                                        label="Ngày kết thúc"
                                                        renderInput={function (props) {
                                                            return (
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
                                                            );
                                                        }}
                                                        value={field.value}
                                                        onChange={function (newValue) {
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Stack>
                        <Stack>
                            <InputLabel>Trạng thái</InputLabel>
                            <Controller
                                name="trangThai"
                                control={control}
                                render={function ({ field: { onChange, ...otherFieldProps } }) {
                                    return (
                                        <Select
                                            onChange={function (event, child) {
                                                onChange(event, child);
                                            }}
                                            {...otherFieldProps}
                                        >
                                            {STATUS_LIST.map(function (item) {
                                                return (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.label}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    );
                                }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} pt={2}>
                            <Button
                                sx={{
                                    width: 90,
                                    px: 0,
                                    textTransform: "unset",
                                }}
                                variant="contained"
                                size="small"
                                type="submit"
                            >
                                {id ? "Lưu" : "Thêm"}
                            </Button>
                            <Button
                                sx={{
                                    width: 90,
                                    px: 0,
                                    textTransform: "unset",
                                    color: "#090a0c",
                                }}
                                variant="outlined"
                                size="small"
                                onClick={handleReset}
                            >
                                Clear form
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, flex: 1 }}>
                    <SoftTypography sx={{ fontWeight: 500 }}>Danh sách sản phẩm</SoftTypography>
                    <Stack spacing={1} mt={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                                placeholder="Tìm kiếm sản phẩm"
                                value={productFilter.tenSanPham || ""}
                                onChange={function (e) {
                                    setProductFilter(function (filter) { return { ...filter, tenSanPham: e.target.value }; });
                                    debounceRef.current(e.target.value);
                                }}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                sx={{
                                    minWidth: 40,
                                    px: 1,
                                    color: "#090a0c",
                                    borderRadius: 2,
                                }}
                                onClick={function () { setFilterModalOpen(true); }}
                            >
                                Lọc
                            </Button>
                        </Stack>
                        <Table columns={productColumns} rows={products} />
                        <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            marginTop={2}
                            flexWrap="wrap"
                            gap={2}
                        >
                            <SoftBox>
                                <Select
                                    value={productPageSize}
                                    onChange={function (e) {
                                        setProductPageSize(Number(e.target.value));
                                        setProductPage(0);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                >
                                    {viewOptions.map(function (number) {
                                        return (
                                            <MenuItem key={number} value={number}>
                                                Xem {number}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </SoftBox>
                            <SoftBox display="flex" alignItems="center" gap={1}>
                                <Button
                                    variant="text"
                                    size="small"
                                    disabled={productPage === 0}
                                    onClick={function () { setProductPage(productPage - 1); }}
                                    sx={{ color: productPage === 0 ? "#bdbdbd" : "#49a3f1" }}
                                >
                                    Trước
                                </Button>
                                {productPaginationItems.map(function (item, index) {
                                    if (item === "...") {
                                        return (
                                            <Button
                                                key={"ellipsis-" + index}
                                                variant="text"
                                                size="small"
                                                disabled
                                                sx={{
                                                    minWidth: 32,
                                                    borderRadius: 2,
                                                    color: "#bdbdbd",
                                                    pointerEvents: "none",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ...
                                            </Button>
                                        );
                                    } else {
                                        return (
                                            <Button
                                                key={item}
                                                variant={productPage === item ? "contained" : "text"}
                                                color={productPage === item ? "info" : "inherit"}
                                                size="small"
                                                onClick={function () { setProductPage(item); }}
                                                sx={{
                                                    minWidth: 32,
                                                    borderRadius: 2,
                                                    color: productPage === item ? "#fff" : "#495057",
                                                    background: productPage === item ? "#49a3f1" : "transparent",
                                                }}
                                            >
                                                {item + 1}
                                            </Button>
                                        );
                                    }
                                })}
                                <Button
                                    variant="text"
                                    size="small"
                                    disabled={productPage === productTotalPages - 1}
                                    onClick={function () { setProductPage(productPage + 1); }}
                                    sx={{ color: productPage === productTotalPages - 1 ? "#bdbdbd" : "#49a3f1" }}
                                >
                                    Sau
                                </Button>
                            </SoftBox>
                        </SoftBox>
                        <Modal open={filterModalOpen} onClose={function () { setFilterModalOpen(false); }}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    bgcolor: "background.paper",
                                    borderRadius: 2,
                                    boxShadow: 24,
                                    p: 0,
                                }}
                            >
                                <ProductFilter
                                    filter={productFilter}
                                    setFilter={setProductFilter}
                                    categories={categories}
                                    onClose={function () { setFilterModalOpen(false); }}
                                />
                            </Box>
                        </Modal>
                    </Stack>
                </Card>
            </Stack>
            {details.length > 0 && (
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, flex: 1 }}>
                    <SoftTypography sx={{ fontWeight: 500, mt: 2 }}>Sản phẩm chi tiết</SoftTypography>
                    <Table
                        columns={selectedColumns}
                        rows={details.map(function (item) {
                            return {
                                id: item.id,
                                image: item.image,
                                tenSanPham: item.tenSanPham,
                                maSanPhamChiTiet: item.maSanPhamChiTiet,
                                gia: item.gia,
                                tenMauSac: item.tenMauSac,
                                tenKichThuoc: item.tenKichThuoc,
                            };
                        })}
                    />
                    <Stack direction="row" justifyContent="flex-end" mt={1}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApply}
                            disabled={!eventId || selectedDetails.length === 0}
                        >
                            Áp dụng
                        </Button>
                    </Stack>
                </Card>
            )}
        </DashboardLayout>
    );
}

export default AddDiscountEventPage;