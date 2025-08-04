package com.example.datn.service;

import com.example.datn.config.CloudinaryService;
import com.example.datn.config.EmailService;
import com.example.datn.dto.DiaChiDTO;
import com.example.datn.dto.KhachHangDTO;
import com.example.datn.entity.DiaChi;
import com.example.datn.entity.KhachHang;
import com.example.datn.repository.DiaChiRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.vo.khachHangVO.KhachHangQueryVO;
import com.example.datn.vo.khachHangVO.KhachHangUpdateVO;
import com.example.datn.vo.khachHangVO.KhachHangVO;
import com.example.datn.vo.khachHangVO.KhachHangWithDiaChiVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service xử lý nghiệp vụ cho Khách Hàng và gửi mail tài khoản với HTML.
 */
@Service
public class KhachHangService {

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private DiaChiRepository diaChiRepository;

    // Inject EmailService ở Config package để gửi email HTML nâng cao
    @Autowired(required = false)
    @Qualifier("emailConfigService")
    private EmailService emailConfigService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Lưu khách hàng, nhận thêm file ảnh (có thể null)
    public Integer save(KhachHangVO vO, MultipartFile imageFile) {
        KhachHang bean = new KhachHang();
        BeanUtils.copyProperties(vO, bean);

        // Upload ảnh nếu có file
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(imageFile);
                bean.setHinhAnh(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi upload ảnh lên Cloudinary: " + e.getMessage(), e);
            }
        }

        bean = khachHangRepository.save(bean);
        return bean.getId();
    }

    /**
     * Thêm đồng thời khách hàng và địa chỉ, đồng thời gửi mail tài khoản/mật khẩu (HTML) nếu có email.
     * Có hỗ trợ upload ảnh lên cloud.
     */
    @Transactional
    public Integer saveWithAddress(KhachHangWithDiaChiVO vO, MultipartFile imageFile) {
        // Tạo khách hàng
        KhachHang kh = new KhachHang();
        BeanUtils.copyProperties(vO.getKhachHang(), kh);

        // Upload ảnh nếu có file
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(imageFile);
                kh.setHinhAnh(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi upload ảnh lên Cloudinary: " + e.getMessage(), e);
            }
        }

        kh = khachHangRepository.save(kh);

        // Tạo địa chỉ gắn với khách hàng vừa tạo
        DiaChi diaChi = new DiaChi();
        BeanUtils.copyProperties(vO.getDiaChi(), diaChi);
        diaChi.setKhachHang(kh);
        diaChiRepository.save(diaChi);

        // Gửi email tài khoản/mật khẩu cho khách hàng nếu có email và emailConfigService cấu hình
        if (emailConfigService != null && kh.getEmail() != null && !kh.getEmail().trim().isEmpty()) {
            String subject = "🎉 Chào mừng bạn đến với Fashion Shirt Shop! 🎉";
            String body = "<div style=\"font-family:'Segoe UI',Arial,sans-serif;background:#f9fafd;padding:32px 0;\">"
                    + "<div style=\"max-width:520px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #e3e3ec;padding:40px 32px 32px 32px;\">"
                    + "<div style=\"text-align:center;\">"
                    + "    <img src=\"https://i.imgur.com/3fJ1P48.png\" alt=\"Logo Shop\" style=\"width:80px;margin-bottom:16px;\">"
                    + "    <h2 style=\"color:#1976d2;margin-bottom:8px;letter-spacing:1px;\">Đăng ký tài khoản thành công!</h2>"
                    + "    <p style=\"color:#444;font-size:17px;margin:0 0 20px 0;\">Xin chào <b style='color:#1976d2\">" + kh.getTenKhachHang() + "</b>,</p>"
                    + "</div>"
                    + "<div style=\"background:#f7fbfd;border-radius:12px;padding:24px 18px;margin:18px 0 22px 0;border:1.5px solid #e3f3fc;\">"
                    + "    <div style=\"font-size:17px;\">"
                    + "        <span style=\"color:#1976d2;font-weight:600;\">Thông tin đăng nhập của bạn:</span><br>"
                    + "        <table style=\"width:100%;margin-top:12px;font-size:16px;\">"
                    + "            <tr><td style=\"padding:6px 0;color:#888;\">Tên đăng nhập:</td><td style=\"font-weight:700;color:#1976d2;\">" + kh.getEmail() + "</td></tr>"
                    + "            <tr><td style=\"padding:6px 0;color:#888;\">Mật khẩu:</td><td style=\"font-weight:700;color:#1976d2;\">" + kh.getMatKhau() + "</td></tr>"
                    + "        </table>"
                    + "        <div style=\"margin-top:20px;color:#444;\">"
                    + "            Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu để bảo mật tài khoản.<br>"
                    + "            <a href=\"http://localhost:3000/dang-nhap\" style=\"display:inline-block;margin-top:16px;padding:10px 32px;background:#1976d2;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;box-shadow:0 2px 8px rgba(25,118,210,0.10);\">Đăng nhập ngay</a>"
                    + "        </div>"
                    + "    </div>"
                    + "</div>"
                    + "<div style=\"font-size:15px;color:#888;text-align:center;margin-top:12px;\">"
                    + "    Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email này.<br>"
                    + "    <i>Đây là email tự động, vui lòng không trả lời lại.</i>"
                    + "</div>"
                    + "</div>"
                    + "</div>";
            try {
                emailConfigService.sendEmail(
                        kh.getEmail(),
                        subject,
                        body
                );
            } catch (Exception ex) {
                System.err.println("Gửi email thất bại: " + ex.getMessage());
            }
        }

        return kh.getId();
    }

    public void delete(Integer id) {
        khachHangRepository.deleteById(id);
    }

    // Cập nhật khách hàng, có thể upload lại ảnh mới
    public void update(Integer id, KhachHangUpdateVO vO, MultipartFile imageFile) {
        KhachHang bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);

        // Nếu có file ảnh mới, upload và cập nhật lại url cloud
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(imageFile);
                bean.setHinhAnh(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi upload ảnh lên Cloudinary: " + e.getMessage(), e);
            }
        }
        khachHangRepository.save(bean);
    }

    public KhachHangDTO getById(Integer id) {
        KhachHang original = requireOne(id);
        return toDTO(original);
    }

    public Page<KhachHangDTO> query(KhachHangQueryVO vO) {
        int page = vO.getPage() != null && vO.getPage() >= 0 ? vO.getPage() : 0;
        int size = vO.getSize() != null && vO.getSize() > 0 ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Specification<KhachHang> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (vO.getId() != null) {
                predicates.add(cb.equal(root.get("id"), vO.getId()));
            }
            if (vO.getMaKhachHang() != null && !vO.getMaKhachHang().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("maKhachHang")), "%" + vO.getMaKhachHang().trim().toLowerCase() + "%"));
            }
            if (vO.getMatKhau() != null && !vO.getMatKhau().trim().isEmpty()) {
                predicates.add(cb.like(root.get("matKhau"), "%" + vO.getMatKhau().trim() + "%"));
            }
            if (vO.getTenKhachHang() != null && !vO.getTenKhachHang().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("tenKhachHang")), "%" + vO.getTenKhachHang().trim().toLowerCase() + "%"));
            }
            if (vO.getEmail() != null && !vO.getEmail().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + vO.getEmail().trim().toLowerCase() + "%"));
            }
            // Giới tính: FE truyền 'Nam'/'Nữ'/'Khác', nếu cần mapping thì sửa tại đây
            if (vO.getGioiTinh() != null) {
                predicates.add(cb.equal(root.get("gioiTinh"), vO.getGioiTinh()));
            }
            if (vO.getSdt() != null && !vO.getSdt().trim().isEmpty()) {
                predicates.add(cb.like(root.get("sdt"), "%" + vO.getSdt().trim() + "%"));
            }
            if (vO.getNgaySinh() != null) {
                predicates.add(cb.equal(root.get("ngaySinh"), vO.getNgaySinh()));
            }
            if (vO.getHinhAnh() != null && !vO.getHinhAnh().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hinhAnh")), "%" + vO.getHinhAnh().trim().toLowerCase() + "%"));
            }
            // Trạng thái: chỉ filter khi FE truyền lên (FE truyền số: 1/0)
            if (vO.getTrangThai() != null && !"".equals(String.valueOf(vO.getTrangThai()))) {
                predicates.add(cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            // Lọc theo khoảng tuổi (tính từ ngày sinh)
            if (vO.getMinAge() != null || vO.getMaxAge() != null) {
                // Tính ngày hiện tại
                java.time.LocalDate today = java.time.LocalDate.now();
                if (vO.getMinAge() != null) {
                    java.time.LocalDate maxBirthDate = today.minusYears(vO.getMinAge());
                    predicates.add(cb.lessThanOrEqualTo(root.get("ngaySinh"), java.sql.Date.valueOf(maxBirthDate)));
                }
                if (vO.getMaxAge() != null) {
                    java.time.LocalDate minBirthDate = today.minusYears(vO.getMaxAge() + 1).plusDays(1);
                    predicates.add(cb.greaterThanOrEqualTo(root.get("ngaySinh"), java.sql.Date.valueOf(minBirthDate)));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<KhachHang> pageResult = khachHangRepository.findAll(spec, pageable);
        return pageResult.map(this::toDTO);
    }

    private KhachHangDTO toDTO(KhachHang original) {
        KhachHangDTO bean = new KhachHangDTO();
        BeanUtils.copyProperties(original, bean);
        List<DiaChi> diaChiList = diaChiRepository.findByKhachHangId(original.getId());
        List<DiaChiDTO> diaChiDTOs = new ArrayList<>();
        for (DiaChi dc : diaChiList) {
            DiaChiDTO dto = new DiaChiDTO();
            BeanUtils.copyProperties(dc, dto);
            diaChiDTOs.add(dto);
        }
        bean.setDiaChis(diaChiDTOs);
        return bean;
    }

    private KhachHang requireOne(Integer id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}