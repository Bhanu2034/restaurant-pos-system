package com.restaurent.pos_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.restaurent.pos_backend.model.AppUser;
import com.restaurent.pos_backend.repository.UserRepository;

@SpringBootApplication
public class PosBackendApplication {

    @Value("${app.default.admin.username}")
    private String adminUsername;

    @Value("${app.default.admin.password:#{null}}")
    private String adminPassword;

    public static void main(String[] args) {
        SpringApplication.run(PosBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminPassword == null || adminPassword.trim().isEmpty()) {
                throw new IllegalStateException("CRITICAL: ADMIN_PASSWORD environment variable must be specified for launch.");
            }

            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername(adminUsername);
                user.setPassword(passwordEncoder.encode(adminPassword));
                user.setRole("admin");
                
                userRepository.save(user);
                System.out.println("Default administrative seed user verified securely.");
            }
        };
    }
}