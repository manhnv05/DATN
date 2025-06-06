package com.example.datn.Service;

import com.example.datn.DTO.HoaDonDTO;
import com.example.datn.Entity.HoaDon;
import com.example.datn.Repository.HoaDonRepository;
import com.example.datn.VO.HoaDonQueryVO;
import com.example.datn.VO.HoaDonUpdateVO;
import com.example.datn.VO.HoaDonVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    public Integer save(HoaDonVO vO) {
        HoaDon bean = new HoaDon();
        BeanUtils.copyProperties(vO, bean);
        bean = hoaDonRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        hoaDonRepository.deleteById(id);
    }

    public void update(Integer id, HoaDonUpdateVO vO) {
        HoaDon bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        hoaDonRepository.save(bean);
    }

    public HoaDonDTO getById(Integer id) {
        HoaDon original = requireOne(id);
        return toDTO(original);
    }

    public Page<HoaDonDTO> query(HoaDonQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private HoaDonDTO toDTO(HoaDon original) {
        HoaDonDTO bean = new HoaDonDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private HoaDon requireOne(Integer id) {
        return hoaDonRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
