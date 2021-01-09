
  package org.sharestory.project.service;
  
  import lombok.AllArgsConstructor;
  import org.springframework.stereotype.Service;
  import org.thymeleaf.TemplateEngine;
  import org.thymeleaf.context.Context;
  import org.sharestory.project.utilentity.EmailMessageContent;
  
  @Service
  @AllArgsConstructor
  public class MailContentBuilder {
  
  private final TemplateEngine templateEngine;
  
  public String build(EmailMessageContent emailMessageContent) { 
	  Context context = new Context();
	  context.setVariable("user", emailMessageContent.getUsername()); context.setVariable("message",
			  emailMessageContent.getLink()); return templateEngine.process("mailTemplate", context);
	  }
  }
 