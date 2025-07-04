import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_PROVINCES_URL = "https://provinces.open-api.vn/api/";

const UpdateOrderInfo = ({ show, onClose, orderId, initialData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({ tenNguoiNhan: "", soDienThoai: "", diaChiCuThe: "" });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadStatusText, setPreloadStatusText] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      const initializeForm = async () => {
        setIsPreloading(true);
        setFormData({
          tenNguoiNhan: initialData?.tenNguoiNhan || "",
          soDienThoai: initialData?.soDienThoai || "",
        });
        setSelectedProvince("");
        setSelectedDistrict("");
        setSelectedWard("");
        setProvinces([]);
        setDistricts([]);
        setWards([]);
        setErrors({});

        const addressString = initialData?.diaChi || "";
        const reversedParts = addressString
            .split(",")
            .map((p) => p.trim())
            .reverse();

        let provinceName = "";
        let districtName = "";
        let wardName = "";
        let diaChiCuThe = "";

        if (reversedParts.length >= 3) {
          provinceName = reversedParts[0] || "";
          districtName = reversedParts[1] || "";
          wardName = reversedParts[2] || "";
          const restParts = reversedParts.slice(3).reverse();
          diaChiCuThe = restParts.join(", ");
        } else {
          diaChiCuThe = addressString;
        }
        setFormData((prev) => ({ ...prev, diaChiCuThe }));

        try {
          setPreloadStatusText("Đang tải danh sách tỉnh/thành...");
          const provincesResponse = await fetch(`${API_PROVINCES_URL}?depth=1`);
          if (!provincesResponse.ok) throw new Error("Lỗi mạng khi tải tỉnh/thành.");
          const provincesData = await provincesResponse.json();
          setProvinces(provincesData);

          if (!provinceName) {
            setIsPreloading(false);
            return;
          }
          const foundProvince = provincesData.find((p) => provinceName.includes(p.name));
          if (foundProvince) {
            setSelectedProvince(foundProvince.code);
          } else {
            setIsPreloading(false);
            toast.error("Không tìm thấy tỉnh/thành phố phù hợp với địa chỉ hiện tại.");
          }
        } catch (error) {
          setIsPreloading(false);
          toast.error("Đã có lỗi xảy ra khi tải dữ liệu địa chỉ tỉnh/thành.");
        }
      };
      initializeForm();
    }
  }, [show, initialData]);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      setWards([]);
      setSelectedWard("");
      return;
    }
    const fetchDistricts = async () => {
      const isInitialLoad = isPreloading;
      if (!isInitialLoad) {
        setPreloadStatusText("Đang tải danh sách quận/huyện...");
        setIsPreloading(true);
      }
      try {
        const response = await fetch(`${API_PROVINCES_URL}p/${selectedProvince}?depth=2`);
        if (!response.ok) throw new Error("Lỗi mạng khi tải quận/huyện.");
        const data = await response.json();
        const fetchedDistricts = data.districts || [];
        setDistricts(fetchedDistricts);

        const reversedParts = (initialData?.diaChi || "")
            .split(",")
            .map((p) => p.trim())
            .reverse();
        if (isInitialLoad && reversedParts.length > 1) {
          const districtName = reversedParts[1] || "";
          const foundDistrict = fetchedDistricts.find((d) => districtName.includes(d.name));
          if (foundDistrict) {
            setSelectedDistrict(foundDistrict.code);
          } else {
            setSelectedDistrict("");
            setWards([]);
            setSelectedWard("");
            toast.error("Không tìm thấy quận/huyện phù hợp với địa chỉ hiện tại.");
          }
        } else {
          setSelectedDistrict("");
          setWards([]);
          setSelectedWard("");
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi tải dữ liệu quận/huyện.");
      } finally {
        if (!isPreloading) setIsPreloading(false);
      }
    };
    fetchDistricts();
  }, [selectedProvince, initialData?.diaChi]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
      return;
    }
    const fetchWards = async () => {
      const isInitialLoad = isPreloading;
      if (!isInitialLoad) {
        setPreloadStatusText("Đang tải danh sách xã/phường...");
        setIsPreloading(true);
      }
      try {
        const response = await fetch(`${API_PROVINCES_URL}d/${selectedDistrict}?depth=2`);
        if (!response.ok) throw new Error("Lỗi mạng khi tải xã/phường.");
        const data = await response.json();
        const fetchedWards = data.wards || [];
        setWards(fetchedWards);

        const reversedParts = (initialData?.diaChi || "")
            .split(",")
            .map((p) => p.trim())
            .reverse();
        if (isInitialLoad && reversedParts.length > 2) {
          const wardName = reversedParts[2] || "";
          const foundWard = fetchedWards.find((w) => wardName.includes(w.name));
          if (foundWard) {
            setSelectedWard(foundWard.code);
          } else {
            setSelectedWard("");
            toast.error("Không tìm thấy xã/phường phù hợp với địa chỉ hiện tại.");
          }
        } else {
          setSelectedWard("");
        }
      } catch (error) {
        toast.error("Đã có lỗi xảy ra khi tải dữ liệu xã/phường.");
      } finally {
        setIsPreloading(false);
      }
    };
    fetchWards();
  }, [selectedDistrict, initialData?.diaChi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (setter, name) => (e) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    let newErrors = {};

    if (!formData.tenNguoiNhan.trim()) {
      newErrors.tenNguoiNhan = "Tên người nhận không được để trống.";
    } else if (formData.tenNguoiNhan.trim().length < 2) {
      newErrors.tenNguoiNhan = "Tên người nhận phải có ít nhất 2 ký tự.";
    }

    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống.";
    } else if (!phoneRegex.test(formData.soDienThoai.trim())) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ.";
    }

    if (!selectedProvince) {
      newErrors.province = "Vui lòng chọn Tỉnh/Thành phố.";
    }
    if (!selectedDistrict) {
      newErrors.district = "Vui lòng chọn Quận/Huyện.";
    }
    if (!selectedWard) {
      newErrors.ward = "Vui lòng chọn Xã/Phường.";
    }

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const provinceName = provinces.find((p) => p.code == selectedProvince)?.name || "";
    const districtName = districts.find((d) => d.code == selectedDistrict)?.name || "";
    const wardName = wards.find((w) => w.code == selectedWard)?.name || "";

    const fullAddress = [formData.diaChiCuThe, wardName, districtName, provinceName]
        .filter((part) => part)
        .join(", ");

    const requestPayload = {
      tenKhachHang: formData.tenNguoiNhan,
      sdt: formData.soDienThoai,
      diaChi: fullAddress,
      ghiChu: "Cập nhật thông tin giao hàng",
    };

    try {
      const backendApiUrl = `http://localhost:8080/api/hoa-don/cap-nhat-thong-tin/${orderId}`;
      const response = await fetch(backendApiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText || "Cập nhật thông tin đơn hàng thất bại.");
        setIsSubmitting(false);
        return;
      }
      toast.success("Cập nhật thông tin đơn hàng thành công.");
      setTimeout(() => {
        if (onClose) onClose();
        if (onUpdateSuccess) onUpdateSuccess();
      }, 500);
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="modal-backdrop fade show"></div>
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Thay đổi thông tin</h5>
                  <button
                      type="button"
                      className="btn-close"
                      onClick={onClose}
                      aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body position-relative">
                  {isPreloading && (
                      <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "inherit",
                          }}
                      >
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 mb-0 fw-bold">{preloadStatusText}</p>
                      </div>
                  )}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="tenNguoiNhan" className="form-label">
                        Tên người nhận <span className="text-danger">*</span>
                      </label>
                      <input
                          type="text"
                          className={`form-control ${errors.tenNguoiNhan ? "is-invalid" : ""}`}
                          id="tenNguoiNhan"
                          name="tenNguoiNhan"
                          value={formData.tenNguoiNhan}
                          onChange={handleInputChange}
                          style={errors.tenNguoiNhan ? { color: "red" } : {}}
                      />
                      {errors.tenNguoiNhan && (
                          <div className="invalid-feedback">{errors.tenNguoiNhan}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="soDienThoai" className="form-label">
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <input
                          type="tel"
                          className={`form-control ${errors.soDienThoai ? "is-invalid" : ""}`}
                          id="soDienThoai"
                          name="soDienThoai"
                          value={formData.soDienThoai}
                          onChange={handleInputChange}
                          style={errors.soDienThoai ? { color: "red" } : {}}
                      />
                      {errors.soDienThoai && (
                          <div className="invalid-feedback">{errors.soDienThoai}</div>
                      )}
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label htmlFor="province" className="form-label">
                        Tỉnh/thành phố <span className="text-danger">*</span>
                      </label>
                      <select
                          className={`form-select ${errors.province ? "is-invalid" : ""}`}
                          id="province"
                          value={selectedProvince}
                          onChange={handleSelectChange(setSelectedProvince, "province")}
                          style={errors.province ? { color: "red" } : {}}
                      >
                        <option value="">-- Chọn Tỉnh/Thành phố --</option>
                        {provinces.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                        ))}
                      </select>
                      {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="district" className="form-label">
                        Quận/huyện <span className="text-danger">*</span>
                      </label>
                      <select
                          className={`form-select ${errors.district ? "is-invalid" : ""}`}
                          id="district"
                          value={selectedDistrict}
                          onChange={handleSelectChange(setSelectedDistrict, "district")}
                          disabled={!selectedProvince}
                          style={errors.district ? { color: "red" } : {}}
                      >
                        <option value="">-- Chọn Quận/Huyện --</option>
                        {districts.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.name}
                            </option>
                        ))}
                      </select>
                      {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="ward" className="form-label">
                        Xã/phường <span className="text-danger">*</span>
                      </label>
                      <select
                          className={`form-select ${errors.ward ? "is-invalid" : ""}`}
                          id="ward"
                          value={selectedWard}
                          onChange={handleSelectChange(setSelectedWard, "ward")}
                          disabled={!selectedDistrict}
                          style={errors.ward ? { color: "red" } : {}}
                      >
                        <option value="">-- Chọn Xã/Phường --</option>
                        {wards.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.name}
                            </option>
                        ))}
                      </select>
                      {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="diaChiCuThe" className="form-label">
                      Địa chỉ cụ thể
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="diaChiCuThe"
                        name="diaChiCuThe"
                        placeholder="Số nhà, tên đường (nếu có)..."
                        value={formData.diaChiCuThe}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Hủy
                  </button>
                  <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || isPreloading}
                  >
                    {isSubmitting ? (
                        <>
                      <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                      ></span>
                          <span className="ms-1">Đang lưu...</span>
                        </>
                    ) : (
                        "Lưu thay đổi"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

UpdateOrderInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialData: PropTypes.shape({
    tenNguoiNhan: PropTypes.string,
    soDienThoai: PropTypes.string,
    diaChi: PropTypes.string,
  }).isRequired,
  onUpdateSuccess: PropTypes.func,
};

export default UpdateOrderInfo;