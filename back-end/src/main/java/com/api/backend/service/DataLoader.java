package com.api.backend.service;

import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public void run(String... args) throws Exception {
        if(usuarioRepository.findByNomeUsuario("admin").isEmpty()) {
            UsuarioModel admin = UsuarioModel.builder()
                    .nomeUsuario("admin")
                    .responsavel("Administrador do Sistema")
                    .tipoUsuario(UsuarioModel.TipoUsuario.Admin)
                    .senha(passwordEncoder.encode("admin"))
                    .dataCriacao(LocalDateTime.now())
                    .build();
            usuarioRepository.save(admin);
        }
    }
}
