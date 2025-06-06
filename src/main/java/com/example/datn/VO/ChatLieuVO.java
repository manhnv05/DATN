package com.example.datn.VO;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChatLieuVO implements Serializable {
    private String maChatLieu;
    private String tenChatLieu;
    private Integer trangThai;
}