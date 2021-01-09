package org.sharestory.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

import org.sharestory.project.config.SwaggerConfiguration;
import org.sharestory.project.config.WebConfig;

@SpringBootApplication
@EnableAsync
@Import({SwaggerConfiguration.class, WebConfig.class})
@EnableJpaRepositories(basePackages = {"org.sharestory.project"})
public class SpringReactSharestoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringReactSharestoryApplication.class, args);
	}

}
