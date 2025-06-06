package com.example.datn.Service;

import com.example.datn.DTO.SanPhamDTO;
import com.example.datn.Entity.SanPham;
import com.example.datn.Repository.SanPhamRepository;
import com.example.datn.VO.SanPhamQueryVO;
import com.example.datn.VO.SanPhamUpdateVO;
import com.example.datn.VO.SanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public Integer save(SanPhamVO vO) {
        SanPham bean = new SanPham();
        BeanUtils.copyProperties(vO, bean);
        bean = sanPhamRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        sanPhamRepository.deleteById(id);
    }

    public void update(Integer id, SanPhamUpdateVO vO) {
        SanPham bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        sanPhamRepository.save(bean);
    }

    public SanPhamDTO getById(Integer id) {
        SanPham original = requireOne(id);
        return toDTO(original);
    }

    public Page<SanPhamDTO> query(SanPhamQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private SanPhamDTO toDTO(SanPham original) {
        SanPhamDTO bean = new SanPhamDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private SanPham requireOne(Integer id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
