package com.example.datn.Service;

import com.example.datn.DTO.LichSuHoaDonDTO;
import com.example.datn.Entity.LichSuHoaDon;
import com.example.datn.Repository.LichSuHoaDonRepository;
import com.example.datn.VO.LichSuHoaDonQueryVO;
import com.example.datn.VO.LichSuHoaDonUpdateVO;
import com.example.datn.VO.LichSuHoaDonVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class LichSuHoaDonService {

    @Autowired
    private LichSuHoaDonRepository lichSuHoaDonRepository;

    public Integer save(LichSuHoaDonVO vO) {
        LichSuHoaDon bean = new LichSuHoaDon();
        BeanUtils.copyProperties(vO, bean);
        bean = lichSuHoaDonRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        lichSuHoaDonRepository.deleteById(id);
    }

    public void update(Integer id, LichSuHoaDonUpdateVO vO) {
        LichSuHoaDon bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        lichSuHoaDonRepository.save(bean);
    }

    public LichSuHoaDonDTO getById(Integer id) {
        LichSuHoaDon original = requireOne(id);
        return toDTO(original);
    }

    public Page<LichSuHoaDonDTO> query(LichSuHoaDonQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private LichSuHoaDonDTO toDTO(LichSuHoaDon original) {
        LichSuHoaDonDTO bean = new LichSuHoaDonDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private LichSuHoaDon requireOne(Integer id) {
        return lichSuHoaDonRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
