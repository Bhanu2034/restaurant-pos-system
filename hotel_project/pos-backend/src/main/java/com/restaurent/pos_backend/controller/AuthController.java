package com.restaurent.pos_backend.controller;

import java.util.Optional;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.restaurent.pos_backend.auth.LoginRequest;
import com.restaurent.pos_backend.auth.LoginResponse;
import com.restaurent.pos_backend.auth.UserResponse;
import com.restaurent.pos_backend.model.AppUser;
import com.restaurent.pos_backend.repository.UserRepository;
import com.restaurent.pos_backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        Optional<AppUser> optionalUser =
                userRepository.findByUsername(request.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        AppUser user = optionalUser.get();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(),
        										user.getRole());

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );

        LoginResponse response =
                new LoginResponse(token, userResponse);

        return ResponseEntity.ok(response);
    }
}