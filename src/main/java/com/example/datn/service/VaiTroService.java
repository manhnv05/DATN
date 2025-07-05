package com.example.datn.service;

import com.example.datn.dto.VaiTroDTO;
import com.example.datn.entity.VaiTro;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.vo.vaiTroVO.VaiTroQueryVO;
import com.example.datn.vo.vaiTroVO.VaiTroUpdateVO;
import com.example.datn.vo.vaiTroVO.VaiTroVO;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class VaiTroService {

    private final VaiTroRepository vaiTroRepository;

    public VaiTroService(VaiTroRepository vaiTroRepository) {
        this.vaiTroRepository = vaiTroRepository;
    }

    @Transactional
    public Integer save(VaiTroVO vaiTroVO) {
        VaiTro vaiTro = new VaiTro();
        BeanUtils.copyProperties(vaiTroVO, vaiTro);
        vaiTro = vaiTroRepository.save(vaiTro);
        return vaiTro.getId();
    }

    @Transactional
    public VaiTroDTO addRole(VaiTroVO vaiTroVO) {
        VaiTro vaiTro = new VaiTro();
        BeanUtils.copyProperties(vaiTroVO, vaiTro);
        VaiTro savedVaiTro = vaiTroRepository.save(vaiTro);
        return toDTO(savedVaiTro);
    }

    @Transactional
    public void delete(Integer id) {
        VaiTro vaiTro = requireOne(id); // Kiểm tra tồn tại trước khi xóa
        vaiTroRepository.delete(vaiTro);
    }

    @Transactional
    public void update(Integer id, VaiTroUpdateVO vaiTroUpdateVO) {
        VaiTro vaiTro = requireOne(id);
        BeanUtils.copyProperties(vaiTroUpdateVO, vaiTro);
        vaiTroRepository.save(vaiTro);
    }

    public VaiTroDTO getById(Integer id) {
        VaiTro vaiTro = requireOne(id);
        return toDTO(vaiTro);
    }

    public Page<VaiTroDTO> query(VaiTroQueryVO vaiTroQueryVO, Pageable pageable) {
        // Có thể bổ sung custom query theo vaiTroQueryVO nếu cần
        Page<VaiTro> page = vaiTroRepository.findAll(pageable);
        List<VaiTroDTO> vaiTroDTOList = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new PageImpl<>(vaiTroDTOList, pageable, page.getTotalElements());
    }

    public List<VaiTroDTO> getAllVaiTro() {
        List<VaiTro> vaiTroList = vaiTroRepository.findAll();
        return vaiTroList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private VaiTroDTO toDTO(VaiTro vaiTro) {
        VaiTroDTO vaiTroDTO = new VaiTroDTO();
        BeanUtils.copyProperties(vaiTro, vaiTroDTO);
        return vaiTroDTO;
    }

    private VaiTro requireOne(Integer id) {
        return vaiTroRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}