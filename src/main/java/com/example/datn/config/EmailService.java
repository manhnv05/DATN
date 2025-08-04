package com.example.datn.config;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * Email utility for advanced sending (HTML, Unicode, attachments if needed).
 * Nên đặt lại tên thành EmailConfig hoặc EmailUtil để tránh nhầm lẫn với Service logic.
 * Đã dùng @Component("emailConfigService") để tránh xung đột với EmailService ở package Service.
 */
@Component("emailConfigService")
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * Gửi email nâng cao (HTML, Unicode)
     * @param to      Địa chỉ người nhận
     * @param subject Tiêu đề
     * @param body    Nội dung (có thể là HTML)
     * @throws MessagingException Nếu gửi thất bại
     */
    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        messageHelper.setTo(to);
        messageHelper.setSubject(subject);
        messageHelper.setText(body, true); // true cho phép gửi HTML

        javaMailSender.send(mimeMessage);
    }
}