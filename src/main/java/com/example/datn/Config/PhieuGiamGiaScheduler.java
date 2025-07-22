package com.example.datn.Config;


import com.example.datn.Entity.DotGiamGia;
import com.example.datn.Entity.PhieuGiamGia;
import com.example.datn.Repository.DotGiamGiaRepository;
import com.example.datn.Repository.PhieuGiamGiaRepository;
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
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;

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
    @Scheduled(cron = "0 * * * * ?")
    public void updateActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        List<DotGiamGia> expiredPromotions = dotGiamGiaRepository.findByNgayKetThucBeforeAndTrangThaiNot(now, 4);
        List<Integer> excludedTrangThai = Arrays.asList(2, 1, 4);
        List<DotGiamGia> expiredPhieuGiamBD = dotGiamGiaRepository.findByNgayBatDauAfterAndTrangThaiNotIn(now, excludedTrangThai);
        List<DotGiamGia> activePromotions = dotGiamGiaRepository.findDotGiamGiaByNow(now);
        for (DotGiamGia p : expiredPhieuGiamBD) {
            p.setTrangThai(2);
        }
        for (DotGiamGia phieuGiamGia : expiredPromotions) {
            phieuGiamGia.setTrangThai(4);
        }
        for (DotGiamGia p : activePromotions) {
            p.setTrangThai(1);
        }
        List<DotGiamGia> allToSave = new ArrayList<>();
        allToSave.addAll(expiredPhieuGiamBD);
        allToSave.addAll(activePromotions);
        allToSave.addAll(expiredPromotions);
        dotGiamGiaRepository.saveAll(allToSave);
    }
}
