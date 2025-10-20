package com.api.backend.config;

import com.api.backend.service.CustomUserDetailsService;
import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.AbstractRequestMatcherRegistry;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig implements WebMvcConfigurer {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios").hasAnyRole("Chefe", "Admin")
//                        .requestMatchers("/anexos/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/assinatura/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/endereco/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/prioridade-ocorrencia/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/status-ocorrencia/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/subtipo-ocorrencia/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/tipo-arquivo/**").hasAnyRole("Chefe", "Admin", "Analista")
//                        .requestMatchers("/tipo-ocorrencia/**").hasAnyRole("Chefe", "Admin", "Analista")
                        .requestMatchers("/ocorrencias/**").hasAnyRole("Chefe", "Admin", "Analista")
                        .requestMatchers("/log/**").hasAnyRole("Chefe", "Admin")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtRequestFilter(jwtUtil, userDetailsService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // Isso configura o Spring para ignorar a barra final (/) no path da URL
        configurer.setUseTrailingSlashMatch(true);
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
