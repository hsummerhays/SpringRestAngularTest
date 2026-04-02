package com.example.springrestangular.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.audiences}")
    private String appIdUri;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(issuerUri);

        // Validate that the audience includes our app ID URI
        OAuth2TokenValidator<Jwt> audienceValidator = token -> {
            List<String> audiences = token.getAudience();
            System.out.println("Validating token from: " + token.getIssuer());
            System.out.println("Token audiences: " + audiences);
            
            // Allow if exact match with API URI
            if (audiences != null && audiences.contains(appIdUri)) {
                return OAuth2TokenValidatorResult.success();
            }
            
            // Allow if it contains the clientId (common in some MS flows)
            if (audiences != null && audiences.stream().anyMatch(a -> a.contains("b9af3296-edc2-462c-b417-fadc5a695865"))) {
                return OAuth2TokenValidatorResult.success();
            }
            
            System.err.println("JWT Validation Failed: Audience mismatch. Expected: " + appIdUri + " but got: " + audiences);
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "The audience is invalid", null));
        };

        // Validate the issuer (support both v1 and v2 tokens)
        OAuth2TokenValidator<Jwt> issuerValidator = token -> {
            String issuer = token.getIssuer().toString();
            if (issuer.startsWith("https://sts.windows.net/") || issuer.startsWith("https://login.microsoftonline.com/")) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Invalid issuer: " + issuer, null));
        };

        OAuth2TokenValidator<Jwt> combined = new DelegatingOAuth2TokenValidator<>(issuerValidator, audienceValidator);
        decoder.setJwtValidator(combined);
        return decoder;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
