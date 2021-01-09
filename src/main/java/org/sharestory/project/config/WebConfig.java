package org.sharestory.project.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.io.Resource;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

@Configuration
//@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry corsRegistry) {
		corsRegistry.addMapping("/**").allowedOriginPatterns("*").allowedMethods("*").maxAge(3600L).allowedHeaders("*")
				.exposedHeaders("Authorization").allowCredentials(true);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
		ResourceResolver resolver = new ReactResourceResolver();
        registry.addResourceHandler("/**")
                .resourceChain(true)
                .addResolver(resolver);
	}
	//@Override
	//public void addViewControllers(ViewControllerRegistry registry) {
		//registry.addViewController("/{spring:\\w+}").setViewName("forward:/");
		//registry.addViewController("/**/{spring:\\w+}").setViewName("forward:/");
		//registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}").setViewName("forward:/");
	//}
}

class ReactResourceResolver implements ResourceResolver {
    // root dir of react files
    // example REACT_DIR/index.html
    private static final String REACT_DIR = "/static/";

    // this is directory inside REACT_DIR for react static files
    // example REACT_DIR/REACT_STATIC_DIR/js/
    // example REACT_DIR/REACT_STATIC_DIR/css/
    private static final String REACT_STATIC_DIR = "static";

    private Resource index = new ClassPathResource(REACT_DIR + "index.html");
    private List<String> rootStaticFiles = Arrays.asList("favicon.io",
            "asset-manifest.json", "manifest.json", "service-worker.js");

    @Override
    public Resource resolveResource(
        HttpServletRequest request, String requestPath,
        List<? extends Resource> locations, ResourceResolverChain chain) {

        return resolve(requestPath, locations);
    }

    @Override
    public String resolveUrlPath(
        String resourcePath, List<? extends Resource> locations,
        ResourceResolverChain chain) {

        Resource resolvedResource = resolve(resourcePath, locations);
        if (resolvedResource == null) {
            return null;
        }
        try {
            return resolvedResource.getURL().toString();
        } catch (IOException e) {
            return resolvedResource.getFilename();
        }
    }

    private Resource resolve(
        String requestPath, List<? extends Resource> locations) {

        if (requestPath == null) return null;

        if (rootStaticFiles.contains(requestPath)
                || requestPath.startsWith(REACT_STATIC_DIR) || requestPath.startsWith("js")
                || requestPath.startsWith("css")) {
            return new ClassPathResource(REACT_DIR + requestPath);
        } else
            return index;
    }

}