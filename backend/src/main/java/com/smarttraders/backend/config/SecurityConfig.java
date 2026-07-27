package com.smarttraders.backend.config;

import com.smarttraders.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/crops").hasRole("FARMER")
                .requestMatchers(HttpMethod.PUT, "/api/crops/**").hasRole("FARMER")
                .requestMatchers(HttpMethod.DELETE, "/api/crops/**").hasRole("FARMER")
                .requestMatchers(HttpMethod.POST, "/api/products").hasRole("TRADER")
                .requestMatchers(HttpMethod.POST, "/api/vendor-listings").hasRole("VENDOR")
                .requestMatchers(HttpMethod.PUT, "/api/vendor-listings/**").hasRole("VENDOR")
                .requestMatchers(HttpMethod.DELETE, "/api/vendor-listings/**").hasRole("VENDOR")
                .requestMatchers(HttpMethod.PUT, "/api/users/location").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/users/nearby-traders").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/crops/*/image").hasRole("FARMER")
                .requestMatchers("/api/users/me").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/transactions").hasAnyRole("TRADER", "VENDOR")
                .requestMatchers(HttpMethod.PATCH, "/api/transactions/*/status").hasRole("FARMER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/ai-test").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/langchain-test").permitAll()
                .requestMatchers("/api/chat/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}