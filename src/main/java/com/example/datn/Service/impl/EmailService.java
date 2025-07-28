package com.example.datn.Service.impl;

import com.example.datn.Entity.NhanVien;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import org.thymeleaf.context.Context;
import java.time.Year;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

     Logger logger = LoggerFactory.getLogger(EmailService.class);
     JavaMailSender mailSender;
     SpringTemplateEngine templateEngine;

    public boolean sendEmailToEmp(NhanVien employee, String psw) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Thiết lập thông tin email
            helper.setTo("hoangbamanh5x12@gmail.com");
            helper.setSubject("Welcome to Our Company - Your Account Details");
            helper.setFrom("hoangbamanh5x12@gmail.com");

            // Chuẩn bị context cho Thymeleaf
            Context context = new Context();
            context.setVariable("fullName", employee.getHoVaTen());
            context.setVariable("username", employee.getEmail());
            context.setVariable("password", psw);

            context.setVariable("loginUrl", "https://yourcompany.com/login");
            context.setVariable("supportEmail", "support@yourcompany.com");
            context.setVariable("supportPhone", "(123) 456-7890");


            context.setVariable("sentDate", new Date());

            context.setVariable("currentYear", String.valueOf(Year.now().getValue()));
            context.setVariable("companyName", "Your Company");

            context.setVariable("companyAddress", "123 Business Street, City, Country");

            // Render nội dung HTML
            String htmlContent = templateEngine.process("email-template", context);
            helper.setText(htmlContent, true);//Gắn nội dung HTML vào email

            // Thêm logo inline
            context.setVariable("logoUrl", "https://res.cloudinary.com/dlyy8kxku/image/upload/v1751170517/z6749204770054_6765f97c0c702094f2ddb86f78503991_kxargw.jpg");

            // Gửi email
            mailSender.send(mimeMessage);
            logger.info("Email sent successfully to {}", employee.getEmail());
            return true;
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", employee.getEmail(), e.getMessage(), e);
            return false;
        }
    }

}
