package com.example.datn.Service;

import com.example.datn.DTO.ChiTietThanhToanDTO;
import com.example.datn.Entity.ChiTietThanhToan;
import com.example.datn.Entity.HinhThucThanhToan;
import com.example.datn.Entity.HoaDon;
import com.example.datn.Repository.ChiTietThanhToanRepository;
import com.example.datn.Repository.HinhThucThanhToanRepository;
import com.example.datn.Repository.HoaDonRepository;
import com.example.datn.VO.ChiTietThanhToanQueryVO;
import com.example.datn.VO.ChiTietThanhToanResponseVO;
import com.example.datn.VO.ChiTietThanhToanUpdateVO;
import com.example.datn.VO.ChiTietThanhToanVO;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;


import java.sql.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ChiTietThanhToanService {

    @Autowired
    private ChiTietThanhToanRepository chiTietThanhToanRepository;
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private HinhThucThanhToanRepository hinhThucThanhToanRepository;


    @Transactional
    public ChiTietThanhToanDTO save(ChiTietThanhToanVO vO) {
        // 1. Tạo một đối tượng Entity mới
        ChiTietThanhToan entity = new ChiTietThanhToan();

        // 2. Sao chép các thuộc tính chung từ VO sang Entity
        BeanUtils.copyProperties(vO, entity);

        // 3. Tìm và gán các đối tượng liên quan (HoaDon, HinhThucThanhToan)
        if (vO.getIdHoaDon() != null) {
            HoaDon hoaDon = hoaDonRepository.findById(vO.getIdHoaDon())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy HoaDon với ID: " + vO.getIdHoaDon()));
            entity.setHoaDon(hoaDon);
        }

        if (vO.getIdHinhThucThanhToan() != null) {
            HinhThucThanhToan hinhThucThanhToan = hinhThucThanhToanRepository.findById(vO.getIdHinhThucThanhToan())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy HinhThucThanhToan với ID: " + vO.getIdHinhThucThanhToan()));
            entity.setHinhThucThanhToan(hinhThucThanhToan);
        }

        // 4. Set ngày thanh toán là ngày hiện tại
        entity.setNgayThanhToan(new Date(System.currentTimeMillis()));

        // 5. Dùng saveAndFlush để ghi ngay lập tức xuống DB
        ChiTietThanhToan savedEntity = chiTietThanhToanRepository.saveAndFlush(entity);

        // 6. Chuyển đổi entity đã lưu sang DTO để trả về cho frontend
        ChiTietThanhToanDTO dto = new ChiTietThanhToanDTO();
        BeanUtils.copyProperties(savedEntity, dto);

        // Gán lại các ID cho DTO
        dto.setIdHoaDon(savedEntity.getHoaDon().getId());
        dto.setIdHinhThucThanhToan(savedEntity.getHinhThucThanhToan().getId());

        return dto;
    }

    public void delete(Integer id) {
        chiTietThanhToanRepository.deleteById(id);
    }

    public void update(Integer id, ChiTietThanhToanUpdateVO vO) {
        ChiTietThanhToan bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chiTietThanhToanRepository.save(bean);
    }

    public ChiTietThanhToanDTO getById(Integer id) {
        ChiTietThanhToan original = requireOne(id);
        return toDTO(original);
    }

    public List<ChiTietThanhToanResponseVO> getChiTietThanhToanByHoaDonId(Integer idHoaDon) {
        return chiTietThanhToanRepository.findChiTietThanhToanByHoaDonId(idHoaDon);
    }

    private ChiTietThanhToanDTO toDTO(ChiTietThanhToan original) {
        ChiTietThanhToanDTO bean = new ChiTietThanhToanDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChiTietThanhToan requireOne(Integer id) {
        return chiTietThanhToanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
