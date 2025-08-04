package com.example.datn.service;

import com.example.datn.dto.DiaChiDTO;
import com.example.datn.entity.DiaChi;
import com.example.datn.entity.KhachHang;
import com.example.datn.repository.DiaChiRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.vo.diaChiVO.DiaChiVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    // Thêm mới địa chỉ
    public Integer save(DiaChiVO vO) {
        DiaChi diaChi = new DiaChi();
        BeanUtils.copyProperties(vO, diaChi);
        if (vO.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(vO.getIdKhachHang())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy khách hàng với id: " + vO.getIdKhachHang()));
            diaChi.setKhachHang(khachHang);
        } else {
            diaChi.setKhachHang(null);
        }
        diaChi = diaChiRepository.save(diaChi);
        return diaChi.getId();
    }

    // Sửa địa chỉ theo id
    public Integer update(Integer id, DiaChiVO vO) {
        DiaChi diaChi = diaChiRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy địa chỉ với id: " + id));
        BeanUtils.copyProperties(vO, diaChi, "id"); // không ghi đè id
        if (vO.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(vO.getIdKhachHang())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy khách hàng với id: " + vO.getIdKhachHang()));
            diaChi.setKhachHang(khachHang);
        }
        diaChiRepository.save(diaChi);
        return diaChi.getId();
    }

    // Xóa địa chỉ theo id
    public void delete(Integer id) {
        if (!diaChiRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy địa chỉ với id: " + id);
        }
        diaChiRepository.deleteById(id);
    }

    // Lấy danh sách tất cả địa chỉ
    public List<DiaChiDTO> findAll() {
        List<DiaChi> diaChis = diaChiRepository.findAll();
        return diaChis.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Lấy địa chỉ theo id
    public DiaChiDTO findById(Integer id) {
        DiaChi diaChi = diaChiRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy địa chỉ với id: " + id));
        return toDTO(diaChi);
    }

    // Lấy danh sách địa chỉ theo id khách hàng
    public List<DiaChiDTO> findByKhachHangId(Integer khachHangId) {
        List<DiaChi> diaChis = diaChiRepository.findByKhachHangId(khachHangId);
        return diaChis.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Chuyển entity sang DTO
    private DiaChiDTO toDTO(DiaChi original) {
        DiaChiDTO bean = new DiaChiDTO();
        BeanUtils.copyProperties(original, bean);
        if (original.getKhachHang() != null) {
            bean.setIdKhachHang(original.getKhachHang().getId());
        }
        return bean;
    }

    public void setDefaultAddress(Integer customerId, Integer addressId) {
        List<DiaChi> addresses = diaChiRepository.findByKhachHangId(customerId);
        for (DiaChi dc : addresses) {
            if (Objects.equals(dc.getId(), addressId)) {
                dc.setTrangThai(1);
            } else {
                dc.setTrangThai(0);
            }
            diaChiRepository.save(dc);
        }
    }
}