package com.example.datn.Service;

import com.example.datn.DTO.HinhAnhDTO;
import com.example.datn.Entity.HinhAnh;
import com.example.datn.Repository.HinhAnhRepository;
import com.example.datn.Repository.ChiTietSanPhamRepository;
import com.example.datn.VO.HinhAnhQueryVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.NoSuchElementException;

@Service
public class HinhAnhService {

    @Autowired
    private HinhAnhRepository hinhAnhRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Integer save(String maAnh, Integer anhMacDinh, String moTa, Integer trangThai, MultipartFile duongDanAnh) {
        HinhAnh bean = new HinhAnh();
        bean.setMaAnh(maAnh);
        bean.setAnhMacDinh(anhMacDinh);
        bean.setMoTa(moTa);
        bean.setTrangThai(trangThai);

        if (duongDanAnh != null && !duongDanAnh.isEmpty()) {
            String fileName = saveFile(duongDanAnh);
            bean.setDuongDanAnh(fileName);
        }

        bean = hinhAnhRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        hinhAnhRepository.deleteById(id);
    }

    public void update(Integer id, String maAnh, Integer anhMacDinh, String moTa, Integer trangThai, MultipartFile duongDanAnh) {
        HinhAnh bean = requireOne(id);
        bean.setMaAnh(maAnh);
        bean.setAnhMacDinh(anhMacDinh);
        bean.setMoTa(moTa);
        bean.setTrangThai(trangThai);

        if (duongDanAnh != null && !duongDanAnh.isEmpty()) {
            String fileName = saveFile(duongDanAnh);
            bean.setDuongDanAnh(fileName);
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
}
