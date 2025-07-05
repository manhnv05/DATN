package com.example.datn.service;

import com.example.datn.dto.HinhAnhDTO;
import com.example.datn.entity.HinhAnh;
import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.repository.HinhAnhRepository;
import com.example.datn.repository.ChiTietSanPhamRepository;
import com.example.datn.vo.hinhAnhVO.HinhAnhQueryVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class HinhAnhService {

    @Autowired
    private HinhAnhRepository hinhAnhRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Sửa hàm save để nhận thêm idSanPhamChiTiet và gán vào entity
     */
    public Integer save(
            String maAnh,
            Integer anhMacDinh,
            String moTa,
            Integer trangThai,
            MultipartFile duongDanAnh,
            Integer idSanPhamChiTiet // thêm tham số này
    ) {
        HinhAnh bean = new HinhAnh();
        bean.setMaAnh(maAnh);
        bean.setAnhMacDinh(anhMacDinh);
        bean.setMoTa(moTa);
        bean.setTrangThai(trangThai);

        if (duongDanAnh != null && !duongDanAnh.isEmpty()) {
            String fileName = saveFile(duongDanAnh);
            bean.setDuongDanAnh(fileName);
        }

        // Gán id_san_pham_chi_tiet vào entity nếu được truyền lên
        if (idSanPhamChiTiet != null) {
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                    .orElse(null);
            bean.setChiTietSanPham(chiTietSanPham);
        }

        bean = hinhAnhRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        hinhAnhRepository.deleteById(id);
    }

    /**
     * Sửa hàm update để nhận thêm idSanPhamChiTiet và cập nhật nếu có
     */
    public void update(
            Integer id,
            String maAnh,
            Integer anhMacDinh,
            String moTa,
            Integer trangThai,
            String duongDanAnh, // <-- sửa kiểu dữ liệu
            Integer idSanPhamChiTiet
    ) {
        HinhAnh bean = requireOne(id);
        bean.setMaAnh(maAnh);
        bean.setAnhMacDinh(anhMacDinh);
        bean.setMoTa(moTa);
        bean.setTrangThai(trangThai);

        if (duongDanAnh != null && !duongDanAnh.isEmpty()) {
            bean.setDuongDanAnh(duongDanAnh);
        }

        // Cập nhật chiTietSanPham nếu truyền lên
        if (idSanPhamChiTiet != null) {
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(idSanPhamChiTiet)
                    .orElse(null);
            bean.setChiTietSanPham(chiTietSanPham);
        }

        hinhAnhRepository.save(bean);
    }

    public HinhAnhDTO getById(Integer id) {
        HinhAnh original = requireOne(id);
        return toDTO(original);
    }

    public Page<HinhAnhDTO> query(HinhAnhQueryVO vO) {
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Specification<HinhAnh> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();
            if (vO.getId() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("id"), vO.getId()));
            }
            if (vO.getIdSanPhamChiTiet() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("chiTietSanPham").get("id"), vO.getIdSanPhamChiTiet()));
            }
            if (vO.getMaAnh() != null && !vO.getMaAnh().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("maAnh")), "%" + vO.getMaAnh().toLowerCase() + "%"));
            }
            if (vO.getDuongDanAnh() != null && !vO.getDuongDanAnh().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("duongDanAnh")), "%" + vO.getDuongDanAnh().toLowerCase() + "%"));
            }
            if (vO.getAnhMacDinh() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("anhMacDinh"), vO.getAnhMacDinh()));
            }
            if (vO.getMoTa() != null && !vO.getMoTa().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("moTa")), "%" + vO.getMoTa().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return predicates;
        };

        Page<HinhAnh> entities = hinhAnhRepository.findAll(spec, pageable);
        return entities.map(this::toDTO);
    }

    private HinhAnhDTO toDTO(HinhAnh original) {
        HinhAnhDTO bean = new HinhAnhDTO();
        BeanUtils.copyProperties(original, bean);
        if (original.getChiTietSanPham() != null) {
            bean.setIdSanPhamChiTiet(original.getChiTietSanPham().getId());
        } else {
            bean.setIdSanPhamChiTiet(null);
        }
        return bean;
    }

    private HinhAnh requireOne(Integer id) {
        return hinhAnhRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }

    // ✅ Lưu file ảnh và trả về đường dẫn tương đối dạng "/images/ten_anh.jpg"
    private String saveFile(MultipartFile file) {
        try {
            // Đảm bảo uploadDir kết thúc bằng dấu /
            String folderPath = uploadDir.endsWith("/") || uploadDir.endsWith("\\") ? uploadDir : uploadDir + "/";
            File dir = new File(folderPath);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (!created) {
                    throw new RuntimeException("Không tạo được thư mục lưu ảnh: " + dir.getAbsolutePath());
                }
            }

            String fileName = file.getOriginalFilename();
            String baseName = fileName;
            String ext = "";
            int dot = fileName.lastIndexOf(".");
            if (dot > 0) {
                baseName = fileName.substring(0, dot);
                ext = fileName.substring(dot);
            }

            File dest = new File(dir, fileName);
            int index = 1;
            while (dest.exists()) {
                fileName = baseName + "(" + index + ")" + ext;
                dest = new File(dir, fileName);
                index++;
            }

            file.transferTo(dest);

            // ✅ Trả về đường dẫn ảnh để frontend hiển thị
            return "/images/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file ảnh: " + e.getMessage(), e);
        }
    }

    public List<HinhAnhDTO> findAll() {
        return hinhAnhRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
}