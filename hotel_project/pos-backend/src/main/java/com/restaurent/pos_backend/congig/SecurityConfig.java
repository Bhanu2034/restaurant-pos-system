package com.restaurent.pos_backend.congig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.restaurent.pos_backend.security.JwtFilter;

@Configuration
public class SecurityConfig {
	private final JwtFilter jwtFilter;
	
	public SecurityConfig(JwtFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); //encrypts password in database
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		http
			.cors(Customizer.withDefaults())
			.csrf(csrf -> csrf.disable())//Disables csrf because we use jwts
			.cors(cors -> {})
			.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //NO SESSIONS
			.authorizeHttpRequests(auth -> auth

						//Public APIs

				    .requestMatchers("/api/auth/**").permitAll()

				    //Static Resources

				    .requestMatchers(
				            "/",
				            "/index.html",
				            "/assets/**",
				            "/favicon.svg",
				            "/icons.svg",
				            "/error",
				            "/ws-pos/**")
				    .permitAll()

				    //Dashboard

				    .requestMatchers("/api/dashboard/**")
				    .hasRole(
				            "ADMIN")

				    //Billing

				    .requestMatchers("/api/billing/**")
				    .hasRole(
				            "ADMIN")

				    	//Takeaway

				    .requestMatchers("/api/takeaway/**")
				    .hasRole(
				            "ADMIN")
				          

				    //Kitchen

				    .requestMatchers("/api/kots/**")
				    .hasRole(
				            "ADMIN")
				            

				    //tables

				    .requestMatchers("/api/tables/**")
				    .hasRole(
				            "ADMIN")
				            

				    //Inventory

				    .requestMatchers("/api/inventory/**")
				    .hasAnyRole(
				            "ADMIN")
				            

				    //menu

				    .requestMatchers("/api/menu/**")
				    .hasRole("ADMIN")

				    //User Management

				    .requestMatchers("/api/users/**")
				    .hasRole("ADMIN")

				    //Remaining

				    .anyRequest()
				    .authenticated()
				)
			
			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
		
		
	}
}
