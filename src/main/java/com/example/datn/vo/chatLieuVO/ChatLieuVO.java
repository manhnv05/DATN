package com.example.datn.vo.chatLieuVO;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChatLieuVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String maChatLieu;
    private String tenChatLieu;
    private Integer trangThai;
}