import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// API để lấy danh sách địa chỉ của Việt Nam
const API_PROVINCES_URL = "https://provinces.open-api.vn/api/";
const UpdateOrderInfo = ({ show, onClose, orderId, initialData, onUpdateSuccess }) => {
  // --- STATE QUẢN LÝ FORM ---
  const [formData, setFormData] = useState({ tenNguoiNhan: "", soDienThoai: "", diaChiCuThe: "" });

  // --- STATE QUẢN LÝ CÁC DROPDOWN ĐỊA CHỈ ---
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // --- STATE QUẢN LÝ TRẠNG THÁI LOADING ---
  const [isSubmitting, setIsSubmitting] = useState(false); // Khi nhấn nút submit
  const [isPreloading, setIsPreloading] = useState(false); // Khi modal đang tự động điền dữ liệu
  const [preloadStatusText, setPreloadStatusText] = useState(""); // Text hiển thị khi pre-loading

  // --- STATE QUẢN LÝ LỖI VALIDATION ---
  const [errors, setErrors] = useState({}); // Object chứa các thông báo lỗi


  useEffect(() => {
    if (show) {
      console.log("Initial Order Data (initialData):", initialData);
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

        let provinceName = "",
            districtName = "",
            wardName = "",
            diaChiCuThe = "";

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
          }
        } catch (error) {
          console.error("Lỗi trong quá trình tự động điền địa chỉ:", error);
          alert("Đã có lỗi xảy ra khi tải dữ liệu địa chỉ.");
          setIsPreloading(false);
        }
      };
      initializeForm();
    }
  }, [show, initialData]);

  // EFFECT PHỤ: Tải huyện khi tỉnh thay đổi (bởi người dùng hoặc tự động)
  // Cần đảm bảo các fetch này chạy đúng thứ tự và cập nhật selectedDistrict/Ward.
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      setWards([]); // Reset wards khi tỉnh thay đổi
      setSelectedWard(""); // Reset selectedWard khi tỉnh thay đổi
      return;
    }
    const fetchDistricts = async () => {
      const isInitialLoad = isPreloading; // Lưu trạng thái preloading hiện tại
      if (!isInitialLoad) {
        // Chỉ hiển thị spinner nếu không phải đang trong quá trình preload ban đầu
        setPreloadStatusText("Đang tải danh sách quận/huyện...");
        setIsPreloading(true);
      }
      try {
        const response = await fetch(`${API_PROVINCES_URL}p/${selectedProvince}?depth=2`);
        const data = await response.json();
        const fetchedDistricts = data.districts || [];
        setDistricts(fetchedDistricts);

        const reversedParts = (initialData?.diaChi || "")
            .split(",")
            .map((p) => p.trim())
            .reverse();
        if (isInitialLoad && reversedParts.length > 1) {
          // Chỉ tự động điền trong lần load đầu
          const districtName = reversedParts[1] || "";
          const foundDistrict = fetchedDistricts.find((d) => districtName.includes(d.name));
          if (foundDistrict) {
            setSelectedDistrict(foundDistrict.code);
          } else {
            setSelectedDistrict(""); // Đảm bảo clear nếu không tìm thấy
            setWards([]);
            setSelectedWard("");
          }
        } else {
          // Nếu không phải initial load, reset district/ward
          setSelectedDistrict("");
          setWards([]);
          setSelectedWard("");
        }
      } catch (error) {
        console.error("Lỗi tải huyện:", error);
      } finally {
        if (!isInitialLoad) setIsPreloading(false);
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
      const isInitialLoad = isPreloading; // Lưu trạng thái preloading hiện tại
      if (!isInitialLoad) {
        // Chỉ hiển thị spinner nếu không phải đang trong quá trình preload ban đầu
        setPreloadStatusText("Đang tải danh sách xã/phường...");
        setIsPreloading(true);
      }
      try {
        const response = await fetch(`${API_PROVINCES_URL}d/${selectedDistrict}?depth=2`);
        const data = await response.json();
        const fetchedWards = data.wards || [];
        setWards(fetchedWards);

        const reversedParts = (initialData?.diaChi || "")
            .split(",")
            .map((p) => p.trim())
            .reverse();
        if (isInitialLoad && reversedParts.length > 2) {
          // Chỉ tự động điền trong lần load đầu
          const wardName = reversedParts[2] || "";
          const foundWard = fetchedWards.find((w) => wardName.includes(w.name));
          if (foundWard) {
            setSelectedWard(foundWard.code);
          } else {
            setSelectedWard(""); // Đảm bảo clear nếu không tìm thấy
          }
        } else {
          // Nếu không phải initial load, reset ward
          setSelectedWard("");
        }
      } catch (error) {
        console.error("Lỗi tải xã:", error);
      } finally {
        setIsPreloading(false);
      }
    };
    fetchWards();
  }, [selectedDistrict, initialData?.diaChi]); // Thêm initialData.diaChi vào dependency để đảm bảo tự động điền đúng

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (setter, name) => (e) => {
    setter(e.target.value);
    // Xóa lỗi cho trường này ngay khi người dùng chọn
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Xóa tất cả lỗi cũ trước khi validate lại


    let newErrors = {};

    // --- VALIDATION LOGIC ---
    if (!formData.tenNguoiNhan.trim()) {
      newErrors.tenNguoiNhan = "Tên người nhận không được để trống.";
    } else if (formData.tenNguoiNhan.trim().length < 2) {
      newErrors.tenNguoiNhan = "Tên người nhận phải có ít nhất 2 ký tự.";
    }

    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/; // Regex cho số điện thoại Việt Nam
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
    // diaChiCuThe có thể trống

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return; // Dừng submit nếu có lỗi
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
    console.log("Tên người nhận (tenKhachHang) khi submit:", requestPayload.tenKhachHang);

    try {
      const backendApiUrl = `http://localhost:8080/api/hoa-don/cap-nhat-thong-tin/${orderId}`;
      const response = await fetch(backendApiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Cập nhật thất bại");
      }
      toast.success("Cập nhật thông tin đơn hàng thành công!");
      setTimeout(() => {
        if (onClose) onClose();
        if (onUpdateSuccess) onUpdateSuccess();
      }, 500); // Đợi 0.5 giây (500ms) trước khi đóng modal
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!show) {
    return null;
  }

  return (
      <div>

        <div className="modal-backdrop fade show"></div>
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit} >
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
                          // THAY ĐỔI Ở ĐÂY: Áp dụng inline style cho màu chữ
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
                          // THAY ĐỔI Ở ĐÂY
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

                          // THAY ĐỔI Ở ĐÂY
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
                          // THAY ĐỔI Ở ĐÂY
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
                          // THAY ĐỔI Ở ĐÂY
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
                        // THAY ĐỔI Ở ĐÂY (mặc dù không bắt buộc, nếu bạn muốn cũng có thể đổi màu chữ khi có lỗi)
                        // style={errors.diaChiCuThe ? { color: 'red' } : {}}
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