package com.api.backend.service;

import com.api.backend.config.JwtUtil;
import com.api.backend.dto.LoginRequest;
import com.api.backend.dto.LoginResponse;
import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService UserDetailsService;
    private final UsuarioRepository usuarioRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getCpf(),
                        loginRequest.getSenha()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = UserDetailsService.loadUserByUsername(loginRequest.getCpf());

        String token = jwtUtil.generateToken(userDetails);

        UsuarioModel usuario = usuarioRepository.findByCpf(loginRequest.getCpf())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado"));

        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return new LoginResponse(
                token,
                usuario.getNomeUsuario(),
                usuario.getTipoUsuario().name(),
                usuario.getCpf()
        );
    }
}
