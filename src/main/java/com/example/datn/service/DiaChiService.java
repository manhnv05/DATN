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
}