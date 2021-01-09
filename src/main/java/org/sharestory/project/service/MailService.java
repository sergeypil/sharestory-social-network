package org.sharestory.project.service;

import org.sharestory.project.exceptions.SpringSharestoryException;
import org.sharestory.project.utilentity.NotificationEmail;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
class MailService {

    private final JavaMailSender mailSender;

    @Async
    void sendMail(NotificationEmail notificationEmail, boolean html) {
		
		  MimeMessagePreparator messagePreparator = mimeMessage -> { MimeMessageHelper
		  messageHelper = new MimeMessageHelper(mimeMessage);
		  //messageHelper.setFrom("sharestory.project@gmail.com");
		  messageHelper.setTo(notificationEmail.getRecipient());
		  messageHelper.setSubject(notificationEmail.getSubject());
		  messageHelper.setText(notificationEmail.getBody(), html);
		  };
        try {
            mailSender.send(messagePreparator);
            log.info("Email sent!");
        } catch (MailException e) {
            log.error("Exception occurred when sending mail", e);
            throw new SpringSharestoryException("Exception occurred when sending mail to " + notificationEmail.getRecipient(), e);
        }
    }

}