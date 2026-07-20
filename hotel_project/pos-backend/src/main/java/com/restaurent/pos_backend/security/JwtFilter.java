package com.restaurent.pos_backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter{
	
	private final JwtUtil jwtUtil;
	
	public JwtFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response , FilterChain chain) 
	          throws ServletException, IOException{
		
			final String authHeader = request.getHeader("Authorization");
			
			// check if the request has the "Bearer" token
			if(authHeader != null && authHeader.startsWith("Bearer")) {
				String token = authHeader.substring(7);
				
				if(jwtUtil.validateToken(token)) {
					String username = jwtUtil.extractUsername(token);
					
					// if vaid , spring security consider the user as valid and allowed in
					String role = jwtUtil.extractRole(token).toUpperCase();

					List<SimpleGrantedAuthority> authorities =
					        List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

					UsernamePasswordAuthenticationToken authToken =
					        new UsernamePasswordAuthenticationToken(
					                username,
					                null,
					                authorities
					        );
					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
			
			// continue the request to the controller
			chain.doFilter(request, response);
		
	}
	
}
