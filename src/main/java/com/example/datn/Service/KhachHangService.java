package com.example.datn.Service;

import com.example.datn.DTO.KhachHangDTO;
import com.example.datn.Entity.DiaChi;
import com.example.datn.Entity.KhachHang;
import com.example.datn.Repository.DiaChiRepository;
import com.example.datn.Repository.KhachHangRepository;
import com.example.datn.VO.KhachHangQueryVO;
import com.example.datn.VO.KhachHangUpdateVO;
import com.example.datn.VO.KhachHangVO;
import com.example.datn.VO.KhachHangWithDiaChiVO;
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
    private com.example.datn.Config.EmailService emailConfigService;

    public Integer save(KhachHangVO vO) {
        KhachHang bean = new KhachHang();
        BeanUtils.copyProperties(vO, bean);
        bean = khachHangRepository.save(bean);
        return bean.getId();
    }

    /**
     * Thêm đồng thời khách hàng và địa chỉ, đồng thời gửi mail tài khoản/mật khẩu (HTML) nếu có email.
     */
    @Transactional
    public Integer saveWithAddress(KhachHangWithDiaChiVO vO) {
        // Tạo khách hàng
        KhachHang kh = new KhachHang();
        BeanUtils.copyProperties(vO.getKhachHang(), kh);
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
                    + "    <p style=\"color:#444;font-size:17px;margin:0 0 20px 0;\">Xin chào <b style='color:#1976d2'>" + kh.getTenKhachHang() + "</b>,</p>"
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

    public void update(Integer id, KhachHangUpdateVO vO) {
        KhachHang bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
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
            if (vO.getTenTaiKhoan() != null && !vO.getTenTaiKhoan().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("tenTaiKhoan")), "%" + vO.getTenTaiKhoan().trim().toLowerCase() + "%"));
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
            if (vO.getGioiTinh() != null) {
                predicates.add(cb.equal(root.get("gioiTinh"), vO.getGioiTinh()));
            }
            if (vO.getSdt() != null && !vO.getSdt().trim().isEmpty()) {
                predicates.add(cb.like(root.get("sdt"), "%" + vO.getSdt().trim() + "%"));
            }
            if (vO.getNgaySinh() != null) {
                predicates.add(cb.equal(root.get("ngaySinh"), vO.getNgaySinh()));
            }
            if (vO.getGhiChu() != null && !vO.getGhiChu().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("ghiChu")), "%" + vO.getGhiChu().trim().toLowerCase() + "%"));
            }
            if (vO.getHinhAnh() != null && !vO.getHinhAnh().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("hinhAnh")), "%" + vO.getHinhAnh().trim().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates.add(cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<KhachHang> pageResult = khachHangRepository.findAll(spec, pageable);
        return pageResult.map(this::toDTO);
    }

    private KhachHangDTO toDTO(KhachHang original) {
        KhachHangDTO bean = new KhachHangDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private KhachHang requireOne(Integer id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}