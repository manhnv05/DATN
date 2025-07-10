package com.example.datn.Service;

import com.example.datn.DTO.DiaChiDTO;
import com.example.datn.Entity.DiaChi;
import com.example.datn.Entity.KhachHang;
import com.example.datn.Repository.DiaChiRepository;
import com.example.datn.Repository.KhachHangRepository;
import com.example.datn.VO.DiaChiVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

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

    public List<DiaChiDTO> findAll() {
        List<DiaChi> diaChis = diaChiRepository.findAll();
        return diaChis.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private DiaChiDTO toDTO(DiaChi original) {
        DiaChiDTO bean = new DiaChiDTO();
        BeanUtils.copyProperties(original, bean);
        if (original.getKhachHang() != null) {
            bean.setIdKhachHang(original.getKhachHang().getId());
        }
        return bean;
    }
    public List<DiaChiDTO> getAllDiaChiByIdKhachHang(Integer idKhachHang) {
        List<DiaChi> diaChis = diaChiRepository.findByKhachHangId(idKhachHang);
        return diaChis.stream().map(this::toDTO).collect(Collectors.toList());
    }
}