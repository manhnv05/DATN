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
    public Integer save(ChiTietThanhToanVO vO) {
        ChiTietThanhToan bean = new ChiTietThanhToan();
        BeanUtils.copyProperties(vO, bean);
        if (vO.getIdHoaDon() != null) {
            HoaDon hoaDon = hoaDonRepository.findById(vO.getIdHoaDon())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy HoaDon với ID: " + vO.getIdHoaDon()));
            bean.setHoaDon(hoaDon);
        }
        if (vO.getIdHinhThucThanhToan() != null) {
            HinhThucThanhToan hinhThucThanhToan = hinhThucThanhToanRepository.findById(vO.getIdHinhThucThanhToan())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy HinhThucThanhToan với ID: " + vO.getIdHinhThucThanhToan()));
            bean.setHinhThucThanhToan(hinhThucThanhToan);
        }
        bean.setNgayThanhToan(new Date(System.currentTimeMillis()));
        bean = chiTietThanhToanRepository.save(bean);
        return bean.getId();
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
