package com.example.datn.config;


import com.example.datn.entity.PhieuGiamGia;
import com.example.datn.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class PhieuGiamGiaScheduler {
    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Scheduled(cron = "0 * * * * ?")
    public void updateExpiredPromotions() {
        LocalDateTime now = LocalDateTime.now();
        List<PhieuGiamGia> expiredPromotions = phieuGiamGiaRepository.findByNgayKetThucBeforeAndTrangThaiNot(now, 0);
        List<Integer> excludedTrangThai = Arrays.asList(2, 1, 0);
        List<PhieuGiamGia> expiredPhieuGiamBD = phieuGiamGiaRepository.findByNgayBatDauAfterAndTrangThaiNotIn(now, excludedTrangThai);
        List<PhieuGiamGia> activePromotions = phieuGiamGiaRepository.findValidPromotions(now);

        for (PhieuGiamGia p : expiredPhieuGiamBD) {
            p.setTrangThai(2);
        }
        for (PhieuGiamGia phieuGiamGia : expiredPromotions) {
            phieuGiamGia.setTrangThai(0);
        }
        for (PhieuGiamGia p : activePromotions) {
            p.setTrangThai(1);
        }
        List<PhieuGiamGia> allToSave = new ArrayList<>();
        allToSave.addAll(expiredPhieuGiamBD);
        allToSave.addAll(activePromotions);
        allToSave.addAll(expiredPromotions);
        phieuGiamGiaRepository.saveAll(allToSave);
    }
}
