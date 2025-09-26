package com.api.backend.service;

import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByNomeUsuario("admin").isEmpty()) {
            UsuarioModel admin = UsuarioModel.builder()
                    .nomeUsuario("admin")
                    .responsavel("Administrador do Sistema")
                    .tipoUsuario(UsuarioModel.TipoUsuario.Admin)
                    .senha(passwordEncoder.encode("admin"))
                    .dataCriacao(LocalDateTime.now())
                    .build();
            usuarioRepository.save(admin);
        }

        if (usuarioRepository.findByNomeUsuario("joao").isEmpty()) {
            UsuarioModel joao = UsuarioModel.builder()
                    .nomeUsuario("joao")
                    .responsavel("João da Silva")
                    .tipoUsuario(UsuarioModel.TipoUsuario.Analista)
                    .senha(passwordEncoder.encode("123456"))
                    .dataCriacao(LocalDateTime.now())
                    .build();
            usuarioRepository.save(joao);
        }
    }
}
