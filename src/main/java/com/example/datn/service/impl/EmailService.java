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
            helper.setFrom("hoangbamanh5x12@gmail.com");// người gửi email
            helper.setTo(employee.getEmail());// người nhận email
            helper.setSubject("Welcome to Our Company - Your Account Details");// Tiêu đề email

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

            // Thêm logo inline
            context.setVariable("logoUrl", "https://res.cloudinary.com/dlyy8kxku/image/upload/v1751170517/z6749204770054_6765f97c0c702094f2ddb86f78503991_kxargw.jpg");

            // Render nội dung HTML
            String htmlContent = templateEngine.process("email-template", context);
            helper.setText(htmlContent, true);//Gắn nội dung HTML vào email

            // Gửi email
            mailSender.send(mimeMessage);
            logger.info("Email sent successfully to {}", employee.getEmail());
            return true;
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", employee.getEmail(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Gửi email khôi phục mật khẩu
     * 
     * @param employee Nhân viên cần khôi phục mật khẩu
     * @param newPassword Mật khẩu mới
     * @return true nếu gửi thành công, false nếu thất bại
     */
    public boolean sendForgotPasswordEmail(NhanVien employee, String newPassword) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Thiết lập thông tin email
            helper.setFrom("hoangbamanh5x12@gmail.com");
            helper.setTo(employee.getEmail());
            helper.setSubject("Khôi phục mật khẩu - SWEATER");

            // Chuẩn bị context cho Thymeleaf
            Context context = new Context();
            context.setVariable("fullName", employee.getHoVaTen());
            context.setVariable("newPassword", newPassword);
            context.setVariable("loginUrl", "http://localhost:3001/authentication/sign-in");
            context.setVariable("supportEmail", "support@sweater.com");
            context.setVariable("supportPhone", "(123) 456-7890");
            context.setVariable("sentDate", new Date());
            context.setVariable("currentYear", String.valueOf(Year.now().getValue()));
            context.setVariable("companyName", "SWEATER");
            context.setVariable("companyAddress", "123 Fashion Street, City, Country");
            context.setVariable("logoUrl", "https://res.cloudinary.com/dlyy8kxku/image/upload/v1751170517/z6749204770054_6765f97c0c702094f2ddb86f78503991_kxargw.jpg");

            // Render nội dung HTML
            String htmlContent = templateEngine.process("forgot-password-email", context);
            helper.setText(htmlContent, true);

            // Gửi email
            mailSender.send(mimeMessage);
            logger.info("Forgot password email sent successfully to {}", employee.getEmail());
            return true;
        } catch (Exception e) {
            logger.error("Failed to send forgot password email to {}: {}", employee.getEmail(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Gửi email thông báo đổi mật khẩu thành công
     * 
     * @param employee Nhân viên đã đổi mật khẩu
     * @return true nếu gửi thành công, false nếu thất bại
     */
    public boolean sendPasswordChangeNotification(NhanVien employee) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Thiết lập thông tin email
            helper.setFrom("hoangbamanh5x12@gmail.com");
            helper.setTo(employee.getEmail());
            helper.setSubject("Thông báo đổi mật khẩu thành công - SWEATER");

            // Chuẩn bị context cho Thymeleaf
            Context context = new Context();
            context.setVariable("fullName", employee.getHoVaTen());
            context.setVariable("email", employee.getEmail());
            context.setVariable("changeTime", new Date());
            context.setVariable("loginUrl", "http://localhost:3001/authentication/sign-in");
            context.setVariable("supportEmail", "support@sweater.com");
            context.setVariable("supportPhone", "(123) 456-7890");
            context.setVariable("sentDate", new Date());
            context.setVariable("currentYear", String.valueOf(Year.now().getValue()));
            context.setVariable("companyName", "SWEATER");
            context.setVariable("companyAddress", "123 Fashion Street, City, Country");
            context.setVariable("logoUrl", "https://res.cloudinary.com/dlyy8kxku/image/upload/v1751170517/z6749204770054_6765f97c0c702094f2ddb86f78503991_kxargw.jpg");

            // Render nội dung HTML
            String htmlContent = templateEngine.process("password-change-email", context);
            helper.setText(htmlContent, true);

            // Gửi email
            mailSender.send(mimeMessage);
            logger.info("Password change notification email sent successfully to {}", employee.getEmail());
            return true;
        } catch (Exception e) {
            logger.error("Failed to send password change notification email to {}: {}", employee.getEmail(), e.getMessage(), e);
            return false;
        }
    }

}
