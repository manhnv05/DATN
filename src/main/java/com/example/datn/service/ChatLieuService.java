package com.example.datn.service;

import com.example.datn.dto.ChatLieuDTO;
import com.example.datn.entity.ChatLieu;
import com.example.datn.repository.ChatLieuRepository;
import com.example.datn.vo.chatLieuVO.ChatLieuQueryVO;
import com.example.datn.vo.chatLieuVO.ChatLieuUpdateVO;
import com.example.datn.vo.chatLieuVO.ChatLieuVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ChatLieuService {

    @Autowired
    private ChatLieuRepository chatLieuRepository;

    public Integer save(ChatLieuVO vO) {
        ChatLieu bean = new ChatLieu();
        BeanUtils.copyProperties(vO, bean);
        bean = chatLieuRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chatLieuRepository.deleteById(id);
    }

    public void update(Integer id, ChatLieuUpdateVO vO) {
        ChatLieu bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chatLieuRepository.save(bean);
    }

    public ChatLieuDTO getById(Integer id) {
        ChatLieu original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChatLieuDTO> query(ChatLieuQueryVO vO) {
        int page = vO.getPageNumber() != null ? vO.getPageNumber() : 0;
        int size = vO.getPageSize() != null ? vO.getPageSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<ChatLieu> entities = chatLieuRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();

            if (vO.getTenChatLieu() != null && !vO.getTenChatLieu().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("tenChatLieu")), "%" + vO.getTenChatLieu().toLowerCase() + "%"));
            }
            if (vO.getMaChatLieu() != null && !vO.getMaChatLieu().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("maChatLieu")), "%" + vO.getMaChatLieu().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return predicates;
        }, pageable);

        return entities.map(this::toDTO);
    }

    // Thêm hàm lấy tất cả chất liệu cho FE select động
    public List<ChatLieuDTO> findAll() {
        return chatLieuRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ChatLieuDTO toDTO(ChatLieu original) {
        ChatLieuDTO bean = new ChatLieuDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChatLieu requireOne(Integer id) {
        return chatLieuRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}