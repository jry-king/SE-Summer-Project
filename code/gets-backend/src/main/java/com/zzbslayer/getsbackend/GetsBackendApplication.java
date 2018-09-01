package com.zzbslayer.getsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class GetsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GetsBackendApplication.class, args);
	}
}
