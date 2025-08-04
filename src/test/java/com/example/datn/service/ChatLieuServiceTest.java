package com.example.datn.service;

import com.example.datn.dto.ChatLieuDTO;
import com.example.datn.entity.ChatLieu;
import com.example.datn.repository.ChatLieuRepository;
import com.example.datn.vo.chatLieuVO.ChatLieuQueryVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class ChatLieuServiceTest {

    @Mock
    private ChatLieuRepository chatLieuRepository;

    @InjectMocks
    private ChatLieuService chatLieuService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testQueryWithTenChatLieu() {
        // Create test data
        ChatLieu chatLieu1 = new ChatLieu();
        chatLieu1.setId(1);
        chatLieu1.setTenChatLieu("Cotton");
        chatLieu1.setTrangThai(1);

        ChatLieu chatLieu2 = new ChatLieu();
        chatLieu2.setId(2);
        chatLieu2.setTenChatLieu("Silk");
        chatLieu2.setTrangThai(1);

        List<ChatLieu> chatLieuList = Arrays.asList(chatLieu1, chatLieu2);
        Page<ChatLieu> chatLieuPage = new PageImpl<>(chatLieuList);

        // Mock repository behavior
        when(chatLieuRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(chatLieuPage);

        // Create query VO with tenChatLieu
        ChatLieuQueryVO queryVO = new ChatLieuQueryVO();
        queryVO.setTenChatLieu("Cot");
        queryVO.setPageNumber(0);
        queryVO.setPageSize(10);

        // Call the service method
        Page<ChatLieuDTO> result = chatLieuService.query(queryVO);

        // Verify the result
        assertEquals(2, result.getTotalElements());
        assertEquals("Cotton", result.getContent().get(0).getTenChatLieu());
        assertEquals("Silk", result.getContent().get(1).getTenChatLieu());
    }

    @Test
    void testQueryWithEmptyTenChatLieu() {
        // Create test data
        ChatLieu chatLieu1 = new ChatLieu();
        chatLieu1.setId(1);
        chatLieu1.setTenChatLieu("Cotton");
        chatLieu1.setTrangThai(1);

        List<ChatLieu> chatLieuList = Arrays.asList(chatLieu1);
        Page<ChatLieu> chatLieuPage = new PageImpl<>(chatLieuList);

        // Mock repository behavior
        when(chatLieuRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(chatLieuPage);

        // Create query VO with empty tenChatLieu
        ChatLieuQueryVO queryVO = new ChatLieuQueryVO();
        queryVO.setTenChatLieu("");
        queryVO.setPageNumber(0);
        queryVO.setPageSize(10);

        // Call the service method
        Page<ChatLieuDTO> result = chatLieuService.query(queryVO);

        // Verify the result
        assertEquals(1, result.getTotalElements());
        assertEquals("Cotton", result.getContent().get(0).getTenChatLieu());
    }

    @Test
    void testQueryWithNullTenChatLieu() {
        // Create test data
        ChatLieu chatLieu1 = new ChatLieu();
        chatLieu1.setId(1);
        chatLieu1.setTenChatLieu("Cotton");
        chatLieu1.setTrangThai(1);

        List<ChatLieu> chatLieuList = Arrays.asList(chatLieu1);
        Page<ChatLieu> chatLieuPage = new PageImpl<>(chatLieuList);

        // Mock repository behavior
        when(chatLieuRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(chatLieuPage);

        // Create query VO with null tenChatLieu
        ChatLieuQueryVO queryVO = new ChatLieuQueryVO();
        queryVO.setTenChatLieu(null);
        queryVO.setPageNumber(0);
        queryVO.setPageSize(10);

        // Call the service method
        Page<ChatLieuDTO> result = chatLieuService.query(queryVO);

        // Verify the result
        assertEquals(1, result.getTotalElements());
        assertEquals("Cotton", result.getContent().get(0).getTenChatLieu());
    }
}