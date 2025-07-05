package com.example.datn.vo.chatLieuVO;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChatLieuQueryVO implements Serializable {
    private Integer pageNumber;
    private Integer pageSize;

    private Integer id;

    private String maChatLieu;
    private String tenChatLieu;
    private Integer trangThai;
}