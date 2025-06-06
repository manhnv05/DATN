package com.example.datn.Service;

import com.example.datn.DTO.HoaDonChiTietDTO;
import com.example.datn.Entity.HoaDonChiTiet;
import com.example.datn.Repository.HoaDonChiTietRepository;
import com.example.datn.VO.HoaDonChiTietQueryVO;
import com.example.datn.VO.HoaDonChiTietUpdateVO;
import com.example.datn.VO.HoaDonChiTietVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class HoaDonChiTietService {

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    public Integer save(HoaDonChiTietVO vO) {
        HoaDonChiTiet bean = new HoaDonChiTiet();
        BeanUtils.copyProperties(vO, bean);
        bean = hoaDonChiTietRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        hoaDonChiTietRepository.deleteById(id);
    }

    public void update(Integer id, HoaDonChiTietUpdateVO vO) {
        HoaDonChiTiet bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        hoaDonChiTietRepository.save(bean);
    }

    public HoaDonChiTietDTO getById(Integer id) {
        HoaDonChiTiet original = requireOne(id);
        return toDTO(original);
    }

    public Page<HoaDonChiTietDTO> query(HoaDonChiTietQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private HoaDonChiTietDTO toDTO(HoaDonChiTiet original) {
        HoaDonChiTietDTO bean = new HoaDonChiTietDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private HoaDonChiTiet requireOne(Integer id) {
        return hoaDonChiTietRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
